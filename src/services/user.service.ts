import { UserRepository } from '../repository';

class UserService {
  static async userServiceTest(id: number) {
    try {
      //logica random

      const maxUsers = id + 100;

      const userRepositoryData = await UserRepository.userRepositoryTest(maxUsers);
      console.log('test service');

      return {
        status: 200,
        message: 'Test Service OK',
        users: userRepositoryData,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export { UserService };
