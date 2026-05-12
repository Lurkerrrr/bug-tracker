import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by username', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    mockRepository.findOne.mockResolvedValue(mockUser);
    const result = await service.findOne('testuser');
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    const result = await service.findOne('nonexistent');
    expect(result).toBeNull();
  });
});