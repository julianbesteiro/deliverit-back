import { generateToken } from '../utils/tokens';
import { IUserInput } from '../interfaces';
import { UserRepository } from '../repository';
import { UnauthorizedError } from '../errors/customErrors';
import crypto from 'crypto';
import { sendMail } from '../utils/sendEmail';

class UserService {
  static async userServiceTest(id: number) {
    try {
      //logica random

      const maxUsers = id + 100;

      const userRepositoryData = await UserRepository.userRepositoryTest(maxUsers);
      console.log('test service');

      return userRepositoryData;
    } catch (error) {
      console.log(error);
    }
  }

  static async getUserData(id: string) {
    const user = await UserRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
      lastSeenAt: user.lastSeenAt,
      urlImage: user.urlImage,
    };
  }

  static async createUser(user: IUserInput) {
    return await UserRepository.createUser(user);
  }

  static async loginUser(email: string, password: string): Promise<string> {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({ id: user._id });
    return token;
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    //This is to create a 6 digit code. If number is less than 6 digits, it will add 0s to the left
    const maxSixDigitNumber = 999999;
    const resetToken = (
      (parseInt(crypto.randomBytes(3).toString('hex'), 16) % maxSixDigitNumber) +
      1
    )
      .toString()
      .padStart(6, '0');
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 60);

    user.passwordReset = {
      token: resetToken,
      expiration,
    };

    await user.save();

    sendMail(email, resetToken);
  }

  static async verifyResetToken(email: string, token: string): Promise<boolean> {
    const user = await UserRepository.findUserByEmail(email);
    if (!user || !user.passwordReset) {
      return false;
    }

    if (user.passwordReset.token !== token || new Date() > user.passwordReset.expiration) {
      return false;
    }
    return true;
  }

  static async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    const user = await UserRepository.findUserByEmail(email);
    if (!user || !user.passwordReset) {
      throw new UnauthorizedError('User not found');
    }
    if (user.passwordReset.token !== token || new Date() > user.passwordReset.expiration) {
      throw new UnauthorizedError('Invalid token');
    }

    user.password = newPassword;
    user.passwordReset = undefined;

    await user.save();
  }
}

export { UserService };
