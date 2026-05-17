export interface LoginDto {
    username: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
}

export enum UserRole {
    ADMIN = 'admin',
    DEVELOPER = 'developer',
    TESTER = 'tester',
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
}