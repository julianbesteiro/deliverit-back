import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserService } from '../services';

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
}

export { UserController };
