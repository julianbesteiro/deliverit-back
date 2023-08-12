import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';

class UserController {
  static userControllerTest = asyncHandler(async (req: Request, res: Response) => {
    const userServiceData = await UserService.userServiceTest(1);

    console.log('test controller');
    return res.status(200).send({
      status: 200,
      message: 'Test Controller OK',
      users: userServiceData,
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static createUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    return res.status(201).send(user);
  });
}

export { UserController };
