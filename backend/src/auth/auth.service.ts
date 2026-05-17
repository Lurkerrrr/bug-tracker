import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RefreshToken } from './entity/refresh_tokens.entity';
import { UserRole } from '../users/entity/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthAudit');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) { }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });

    this.logger.log(`REGISTER_SUCCESS | username=${user.username} | role=${user.role}`);

    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOne(dto.username);
    if (!user) {
      this.logger.warn(`LOGIN_FAILED | username=${dto.username} | reason=user_not_found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      this.logger.warn(`LOGIN_FAILED | username=${dto.username} | reason=invalid_password`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`LOGIN_SUCCESS | username=${user.username} | role=${user.role} | id=${user.id}`);

    const accessToken = this.generateAccessToken(user.id, user.username, user.role);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(rawRefreshToken: string) {
    // Hash the incoming token and look it up in DB
    const tokenHash = this.hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
    });

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (stored.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete(stored.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.usersService.findById(stored.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.refreshTokenRepository.delete(stored.id);
    const accessToken = this.generateAccessToken(user.id, user.username, user.role);
    const refreshToken = await this.generateRefreshToken(user.id);

    this.logger.log(`TOKEN_REFRESHED | username=${user.username} | id=${user.id}`);

    return { accessToken, refreshToken };
  }

  async logout(rawRefreshToken: string) {
    // Invalidate the refresh token on logout
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.refreshTokenRepository.delete({ tokenHash });
    this.logger.log(`LOGOUT | tokenHash=${tokenHash.slice(0, 8)}...`);
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  private generateAccessToken(userId: string, username: string, role: string): string {
    return this.jwtService.sign({
      sub: userId,
      username,
      role,
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    // Generate a cryptographically secure random token
    const rawToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    const expirationDays = this.configService.get<string>('app.jwt.expirationExchange') || '7d';
    const days = parseInt(expirationDays.replace('d', ''), 10) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const refreshToken = this.refreshTokenRepository.create({
      userId,
      tokenHash,
      expiresAt,
    });
    await this.refreshTokenRepository.save(refreshToken);

    return rawToken;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}