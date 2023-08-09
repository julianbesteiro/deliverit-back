import User from '../models/User';
import { db } from '../../config/db';

class UserRepository {
  static async userRepositoryTest(maxUsers: number) {
    try {
      await db.connect();

      const allUsers = await User.find().limit(maxUsers);

      db.disconnect();

      console.log('test repository');
      return {
        status: 200,
        message: 'Test Repository OK',
        users: allUsers,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export { UserRepository };
