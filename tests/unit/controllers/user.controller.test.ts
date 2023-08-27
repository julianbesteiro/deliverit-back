import { UserController } from '../../../src/controllers/user.controller';
import { UserService } from '../../../src/services/user.service';
import { mockRequest, mockResponse } from '../../utils/mocks';

jest.mock('../../../src/services/user.service');
UserService.loginUser = jest.fn();
UserService.forgotPassword = jest.fn();

describe('UserController', () => {
  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const mockUserData = {
        id: 1,
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaella@example.com',
        role: 'user',
        enabled: true,
        lastSeenAt: new Date(),
        urlImage: 'http://example.com',
      };
      const req = mockRequest({ body: mockUserData });
      const res = mockResponse();

      (UserService.createUser as jest.Mock).mockResolvedValue(mockUserData);

      await UserController.createUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockUserData);
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const mockUserData = {
        email: 'rafaella@example.com',
        token: 'sampleToken',
      };
      const req = mockRequest({ body: mockUserData });
      const res = mockResponse();

      (UserService.loginUser as jest.Mock).mockResolvedValue(mockUserData.token);

      await UserController.loginUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ token: mockUserData.token });
    });

    it("shouldn't login a user with incorrect credentials", async () => {
      const mockUserData = {
        email: 'rafaella@example.com',
      };
      const req = mockRequest({ body: mockUserData });
      const res = mockResponse();

      (UserService.loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      await UserController.loginUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  describe('forgotPassword', () => {
    it('should send a reset link to an existing email', async () => {
      const mockUserData = {
        email: 'rafaella@example.com',
      };
      const req = mockRequest({ body: mockUserData });
      const res = mockResponse();

      // Mock the UserService method that sends the reset link
      (UserService.forgotPassword as jest.Mock).mockResolvedValue(true);

      await UserController.forgotPassword(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Reset link sent to email' });
    });

    it("shouldn't send a reset link for non-existing email", async () => {
      const mockUserData = {
        email: 'nonexistentrafaella@example.com',
      };
      const req = mockRequest({ body: mockUserData });
      const res = mockResponse();

      (UserService.forgotPassword as jest.Mock).mockResolvedValue(false); // No reset link sent

      await UserController.forgotPassword(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Email does not exist' });
    });

    it('should handle service errors gracefully', async () => {
      const mockUserData = {
        email: 'rafaella@example.com',
      };
      const req = mockRequest({ body: mockUserData });
      const res = mockResponse();

      (UserService.forgotPassword as jest.Mock).mockRejectedValue(new Error('Service error'));

      await UserController.forgotPassword(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Service error' });
    });
  });
});
