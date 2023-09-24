import User from '../models/User';
import { IUser, IUserInput } from '../interfaces';

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

  static async updateUserById(id: string, updateData: Partial<IUser>) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new Error('Error updating user');
    }
  }
}

export { UserRepository };
