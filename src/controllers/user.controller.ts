import { NextFunction, Request, Response } from 'express';
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

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).send(user);
    } catch (error) {
      res.status(500).send({ message: 'User creation failed: ', error });
      next(error);
    }
  }
}

export { UserController };
