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
      console.log('ESTE ES EL ERROR DE LA DB---->', error);
      throw error;
    }
  }
}

export { UserRepository };
