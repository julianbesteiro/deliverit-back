import User from '../models/User';
import { db } from '../../config/db';
import { IUserInput } from '../interfaces';
import { ConflictError, DatabaseConnectionError, ValidationError } from '../errors/customErrors';
import mongoose from 'mongoose';
import { ErrorWithCode } from '../interfaces/IError';

function hasCodeProperty(err: ErrorWithCode): err is ErrorWithCode & { code: number } {
  return err && typeof err.code === 'number';
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

  static async createUser(user: IUserInput) {
    try {
      await db.connect();
      const newUser = await User.create(user);
      db.disconnect();

      return newUser;
    } catch (error) {
      if (hasCodeProperty(error as ErrorWithCode) && (error as ErrorWithCode).code === 11000) {
        // console.log('ESTE ES EL ERROR DE LA DB---->', error);
        if (error instanceof mongoose.Error.ValidationError) {
          throw new ValidationError(error.message);
        } else if ((error as ErrorWithCode).code === 11000) {
          throw new ConflictError('Email already exists');
        } else {
          throw new DatabaseConnectionError('An unexpected error occurred.');
        }
      }
    }
  }
}

export { UserRepository };
