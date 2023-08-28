import { Request, Response } from 'express';
import { UserService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ConflictError } from '../errors/customErrors';

class UserController {
  public static userControllerTest = asyncHandler(async (req: Request, res: Response) => {
    const userServiceData = await UserService.userServiceTest(1);
    return res.status(200).send({
      status: 200,
      message: 'Test Controller OK',
      users: userServiceData,
    });
  });

  static createUser = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).send(user);
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(409).send({
          message: error.message,
        });
      }
      return res.status(500).send({
        message: 'Unexpected error while creating user',
      });
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static loginUser = asyncHandler((req: Request, res: Response) => {
    // TODO: Implement this
    throw new Error('Not implemented yet');
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    //TODO: Implement this
    throw new Error('Not implemented yet');
  });
}

export { UserController };
