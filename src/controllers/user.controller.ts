import { Request, Response } from 'express';
import { UserService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';

class UserController {
  static userControllerTest = asyncHandler(async (req: Request, res: Response) => {
    const userServiceData = await UserService.userServiceTest(1);
    return res.status(200).send({
      status: 200,
      message: 'Test Controller OK',
      users: userServiceData,
    });
  });

  static createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.createUser(req.body);
    return res.status(201).send(user);
  });
}

export { UserController };
