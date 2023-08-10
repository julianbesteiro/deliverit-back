import User from '../models/User';
import { db } from '../../config/db';
import { IUser } from '../interfaces';

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

  static async createUser(user: IUser) {
    try {
      await db.connect();
      const newUser = await User.create(user);
      db.disconnect();

      return newUser;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }
}

export { UserRepository };
