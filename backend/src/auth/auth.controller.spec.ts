import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call register', async () => {
    const dto = { username: 'test', email: 'test@test.com', password: 'password123' };
    mockAuthService.register.mockResolvedValue({ id: '1', username: 'test' });
    const result = await controller.register(dto as any);
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: '1', username: 'test' });
  });

  it('should call login', async () => {
    const dto = { username: 'test', password: 'password123' };
    mockAuthService.login.mockResolvedValue({ access_token: 'token' });
    const result = await controller.login(dto as any);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });
});