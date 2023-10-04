import User from '../models/User';
import { IUser, IUserDocument, IUserInput } from '../interfaces';
import { CustomError } from '../errors/customErrors';

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
    console.log('id', id);
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      throw new CustomError('User not found', 404);
    }
    return updatedUser;
  }
}

export { UserRepository };
