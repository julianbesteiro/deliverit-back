import User from '../models/User';
import { IUser, IUserDocument, IUserInput } from '../interfaces';

class UserRepository {
  static async findUserById(id: string) {
    return await User.findById(id);
  }

  static async createUser(user: IUserInput) {
    const newUser = await User.create(user);
    return newUser;
  }

  static async findUserByEmail(email: string): Promise<IUserDocument | null> {
    const user = await User.findOne({ email });

    return user;
  }

  static async updateUserById(id: string, updateData: Partial<IUser>): Promise<IUserDocument> {
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
