import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../users/entity/user.entity';

export class RegisterDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}

export class LoginDto {
    @IsString()
    username: string;

    @IsString()
    @MinLength(8)
    password: string;
}