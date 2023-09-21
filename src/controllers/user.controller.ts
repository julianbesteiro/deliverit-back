import { Request, Response } from 'express';
import { UserService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { UnauthorizedError, ValidationError } from '../errors/customErrors';
import { RequestExpress } from '../interfaces/IRequestExpress';

class UserController {
  static sendUserData = asyncHandler(async (req: Request | RequestExpress, res: Response) => {
    const { user } = req as RequestExpress;
    if (!user) throw new UnauthorizedError('Unauthorized');
    return res.status(200).send(user);
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

  static logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.setHeader('Authorization', '');
    return res.status(200).send({ message: 'Logout Successful' });
  });

  static requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (email === undefined) throw new ValidationError('Missing fields');
    await UserService.forgotPassword(email);
    return res.status(200).send({ message: 'Email sent' });
  });

  static verifyResetToken = asyncHandler(async (req: Request, res: Response) => {
    const { email, token } = req.body;
    if (email === undefined || token === undefined) throw new ValidationError('Missing fields');
    const isValid = await UserService.verifyResetToken(email, token);
    return res.status(200).send({ isValid });
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, token, newPassword } = req.body;
    if (email === undefined || token === undefined || newPassword === undefined)
      throw new ValidationError('Missing fields');
    await UserService.resetPassword(email, token, newPassword);
    return res.status(200).send({ message: 'Password reset successful' });
  });
}

export { UserController };
