import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    Res,
    Req,
    UseGuards,
    UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request as RequestDecorator } from '@nestjs/common';

const COOKIE_OPTIONS = {
    httpOnly: true,      // JS cannot access these cookies
    secure: process.env.ENV !== 'development',
    sameSite: 'lax' as const,
    path: '/',
};

const ACCESS_TOKEN_TTL = 15 * 60 * 1000;       // 15 minutes in ms
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @ApiOperation({ summary: 'Register a new user (always gets DEVELOPER role)' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @ApiOperation({ summary: 'Login and receive httpOnly cookies with tokens' })
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken, user } = await this.authService.login(dto);

        // Set tokens as httpOnly cookies — not accessible via JavaScript
        res.cookie('access_token', accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: ACCESS_TOKEN_TTL,
        });
        res.cookie('refresh_token', refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: REFRESH_TOKEN_TTL,
        });

        return { user };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const rawRefreshToken = req.cookies?.refresh_token;
        if (!rawRefreshToken) {
            throw new UnauthorizedException('No refresh token provided');
        }

        const { accessToken, refreshToken } = await this.authService.refresh(rawRefreshToken);

        // Rotate both cookies
        res.cookie('access_token', accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: ACCESS_TOKEN_TTL,
        });
        res.cookie('refresh_token', refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: REFRESH_TOKEN_TTL,
        });

        return { message: 'Tokens refreshed' };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and clear token cookies' })
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const rawRefreshToken = req.cookies?.refresh_token;
        if (rawRefreshToken) {
            await this.authService.logout(rawRefreshToken);
        }

        // Clear both cookies
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });

        return { message: 'Logged out successfully' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current authenticated user' })
    me(@RequestDecorator() req) {
        return { user: req.user };
    }
}