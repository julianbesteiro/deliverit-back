import { connect, disconnect } from '../../../config/db/db';
import User from '../../../src/models/User';
import { IUserInput } from '../../../src/interfaces';
import { UserRepository } from '../../../src/repository';

describe('UserRepository', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'rafaella@example.com' });
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
  });
});
