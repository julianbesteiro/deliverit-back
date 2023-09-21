import User from '../models/User';
import { IUserInput } from '../interfaces';

class UserRepository {
  static async findUserById(id: string) {
    return await User.findById(id);
  }

  static async createUser(user: IUserInput) {
    const newUser = await User.create(user);
    return newUser;
  }

  static async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }
}

export { UserRepository };
