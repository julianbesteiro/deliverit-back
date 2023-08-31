import { Request, Response } from 'express';
import { UserService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { UnauthorizedError, ValidationError } from '../errors/customErrors';
import { RequestExpress } from '@/interfaces/IRequestExpress';

class UserController {
  public static userControllerTest = asyncHandler(async (req: Request, res: Response) => {
    const userServiceData = await UserService.userServiceTest(1);
    return res.status(200).send({
      status: 200,
      message: 'Test Controller OK',
      users: userServiceData,
    });
  });

  static getUserData = asyncHandler(async (req: Request | RequestExpress, res: Response) => {
    const { user } = req as RequestExpress;
    if (!user) throw new UnauthorizedError('Unauthorized');
    const userData = await UserService.getUserData(user.id);
    return res.status(200).send(userData);
  });

  static createUser = asyncHandler(async (req: Request, res: Response) => {
    await UserService.createUser(req.body);
    return res.status(201).send('Created Successfully');
  });

  static loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (email === undefined || password === undefined) throw new ValidationError('Missing fields');
    const token = await UserService.loginUser(email, password);
    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).send({ message: 'Login Successful' });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    //TODO: Implement this
    throw new Error('Not implemented yet');
  });
}

export { UserController };
