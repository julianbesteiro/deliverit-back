import { ConflictError, ValidationError } from '../../../src/errors/customErrors';
import { IUserDocument, IUserInput } from '../../../src/interfaces';
import { UserRepository } from '../../../src/repository';
import { UserService } from '../../../src/services';

jest.mock('../../../src/repository/user.repository');

UserRepository.createUser = jest.fn();

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const mockUserData: IUserInput = {
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaella@example.com',
        password: '0303456lalala',
        urlImage: 'http://example.com',
      };

      const mockDbUserResponse = {
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaella@example.com',
        role: 'user',
        enabled: true,
        lastSeenAt: new Date(),
        urlImage: 'http://example.com',
        password: 'hashedPassword123',
      } as IUserDocument;

      (UserRepository.createUser as jest.Mock).mockResolvedValue(mockDbUserResponse);

      const user = await UserService.createUser(mockUserData);
      expect(user).toEqual(mockDbUserResponse);
    });

    it("should throw a ConflictError if the user's email already exists", async () => {
      (UserRepository.createUser as jest.Mock).mockRejectedValue(
        new ConflictError('Email already exists'),
      );

      await expect(
        UserService.createUser({ email: 'rafaella@example.com' } as any),
      ).rejects.toThrow(ConflictError);
    });
  });
});
