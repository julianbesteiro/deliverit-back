import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services';
import { CustomError } from '../interfaces/IError';

function isCustomError(error: unknown): error is CustomError {
  return (error as CustomError).name !== undefined || (error as CustomError).code !== undefined;
}

class UserController {
  static async userControllerTest(req: Request, res: Response) {
    try {
      const userServiceData = await UserService.userServiceTest(1);

      console.log('test controller');
      return res.status(200).send({
        status: 200,
        message: 'Test Controller OK',
        users: userServiceData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).send(user);
    } catch (error: unknown) {
      let statusCode = 500;
      let message = 'An unexpected error occurred.';
      if (isCustomError(error)) {
        if (error.name === 'ValidationError') {
          statusCode = 400;
          message = error.message;
        } else if (error.code === 11000) {
          statusCode = 409;
          message = 'Email already exists.';
        }
      } else {
        console.log(error);
      }

      res.status(statusCode).send({ message, error });
      next(error);
    }
  }
}

export { UserController };
