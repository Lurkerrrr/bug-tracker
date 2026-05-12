import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../users/entity/user.entity';

export class RegisterDto {
    @ApiProperty({ example: 'johndoe' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional({ enum: UserRole, example: UserRole.DEVELOPER })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}

export class LoginDto {
    @ApiProperty({ example: 'johndoe' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'password123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;
}