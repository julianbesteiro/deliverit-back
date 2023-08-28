import { connect, disconnect } from '../../../config/db/db';
import { ConflictError, ValidationError } from '../../../src/errors/customErrors';
import { IUserInput } from '../../../src/interfaces';
import { UserRepository } from '../../../src/repository';

describe('UserRepository', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const user: IUserInput = {
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaella@example.com',
        password: '0303456lalala',
        urlImage: 'http://example.com',
      };

      const createdUser = await UserRepository.createUser(user);

      expect(createdUser?.name).toBe(user.name);
      expect(createdUser?.lastName).toBe(user.lastName);
      expect(createdUser?.email).toBe(user.email);
      expect(createdUser?.role).toBe('user');
      expect(createdUser?.enabled).toBe(true);
      expect(createdUser?.lastSeenAt).toBeDefined();
      expect(createdUser?.urlImage).toBe(user.urlImage);
    });

    it("should throw ConflictError if the user's email already exists", async () => {
      const user = {
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaella@example.com',
        password: '0303456lalala',
        urlImage: 'http://example.com',
      };

      await UserRepository.createUser(user);

      await expect(UserRepository.createUser(user)).rejects.toThrow(ConflictError);
    });

    it('should throw ValidationError on invalid data', async () => {
      const invalidUser = {
        name: 'Rafaella',
        lastName: 'Carra',
      } as IUserInput;

      await expect(UserRepository.createUser(invalidUser)).rejects.toThrow(ValidationError);
    });
  });
});
