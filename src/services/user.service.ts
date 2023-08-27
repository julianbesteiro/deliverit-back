import { IUser } from '../interfaces';
import { UserRepository } from '../repository';

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

  static async createUser(user: IUser) {
    return await UserRepository.createUser(user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async loginUser(userData: { email: string; password: string }): Promise<string> {
    //TO DO: Implement this
    throw new Error('Not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async forgotPassword(email: string): Promise<void> {
    //TO DO: Implement this
    throw new Error('Not implemented yet');
  }
}

export { UserService };
