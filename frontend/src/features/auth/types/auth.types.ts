export interface LoginDto {
    username: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
}

export enum UserRole {
    ADMIN = 'admin',
    DEVELOPER = 'developer',
    TESTER = 'tester',
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: UserRole;
    };
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
}