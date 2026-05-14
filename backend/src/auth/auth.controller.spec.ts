import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  // Mock Express Response object with cookie and clearCookie methods
  const mockRes = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  // Mock Express Request object with cookies
  const mockReq = {
    cookies: { refresh_token: 'mock-refresh-token' },
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

  it('should call login and set cookies', async () => {
    const dto = { username: 'test', password: 'password123' };
    const mockUser = { id: '1', username: 'test', role: 'developer' };
    mockAuthService.login.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: mockUser,
    });
    const result = await controller.login(dto as any, mockRes as any);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    expect(mockRes.cookie).toHaveBeenCalledWith('access_token', 'access-token', expect.any(Object));
    expect(mockRes.cookie).toHaveBeenCalledWith('refresh_token', 'refresh-token', expect.any(Object));
    expect(result).toEqual({ user: mockUser });
  });

  it('should call refresh and rotate cookies', async () => {
    mockAuthService.refresh.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    const result = await controller.refresh(mockReq as any, mockRes as any);
    expect(mockAuthService.refresh).toHaveBeenCalledWith('mock-refresh-token');
    expect(mockRes.cookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ message: 'Tokens refreshed' });
  });

  it('should call logout and clear cookies', async () => {
    mockAuthService.logout.mockResolvedValue(undefined);
    const result = await controller.logout(mockReq as any, mockRes as any);
    expect(mockAuthService.logout).toHaveBeenCalledWith('mock-refresh-token');
    expect(mockRes.clearCookie).toHaveBeenCalledWith('access_token', { path: '/' });
    expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token', { path: '/' });
    expect(result).toEqual({ message: 'Logged out successfully' });
  });
});