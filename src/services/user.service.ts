import { generateToken } from '../utils/tokens';
import { IUserInput } from '../interfaces';
import { UserRepository } from '../repository';
import { UnauthorizedError } from '@/errors/customErrors';

class UserService {
  static async userServiceTest(id: number) {
    try {
      //logica random

      const maxUsers = id + 100;

      const userRepositoryData = await UserRepository.userRepositoryTest(maxUsers);
      console.log('test service');

      return userRepositoryData;
    } catch (error) {
      console.log(error);
    }
  }

  static async createUser(user: IUserInput) {
    return await UserRepository.createUser(user);
  }

  static async loginUser(email: string, password: string): Promise<string> {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid password');
    }

    const token = generateToken({ id: user._id });
    return token;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async forgotPassword(email: string): Promise<void> {
    //TO DO: Implement this
    throw new Error('Not implemented yet');
  }
}

export { UserService };
