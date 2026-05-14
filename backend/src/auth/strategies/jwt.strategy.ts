import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            // Extract JWT from httpOnly cookie instead of Authorization header
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request?.cookies?.access_token ?? null,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.secret') as string,
            passReqToCallback: false,
        });
    }

    async validate(payload: { sub: string; username: string; role: string }) {
        const user = await this.authService.validateUser(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}