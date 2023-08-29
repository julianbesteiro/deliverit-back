import User from '../models/User';
import { db } from '../../config/db';
import { IUserInput } from '../interfaces';

class UserRepository {
  static async userRepositoryTest(maxUsers: number) {
    try {
      await db.connect();

      const allUsers = await User.find().limit(maxUsers);

      db.disconnect();

      console.log('test repository');
      return allUsers;
    } catch (error) {
      console.log(error);
    }
  }

  static async createUser(user: IUserInput) {
    await db.connect();
    const newUser = await User.create(user);
    db.disconnect();
    return newUser;
  }
}

export { UserRepository };
