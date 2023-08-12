import User from '../models/User';
import { db } from '../../config/db';
import { IUser } from '../interfaces';
import { CustomError } from '../interfaces/IError';
import { ConflictError, DatabaseConnectionError, ValidationError } from '../errors/customErrors';

function isCustomError(error: unknown): error is CustomError {
  return (error as CustomError).name !== undefined || (error as CustomError).code !== undefined;
}

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
      if (isCustomError(error)) {
        if (error.name === 'ValidationError') {
          throw new ValidationError(error.message);
        } else if (error.code === 11000) {
          throw new ConflictError(error.message);
        }
      } else {
        console.log('Caught something that is not an Error', error);
        throw new DatabaseConnectionError('An unexpected error occurred.');
      }
    }
  }
}

export { UserRepository };
