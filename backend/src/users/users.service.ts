import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(dto: CreateUserDto): Promise<User> {
        const existing = await this.usersRepository.findOne({
            where: [{ username: dto.username }, { email: dto.email }],
        });
        if (existing) {
            throw new ConflictException('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.usersRepository.create({
            ...dto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            select: ['id', 'username', 'email', 'role', 'createdAt'],
        });
    }
}