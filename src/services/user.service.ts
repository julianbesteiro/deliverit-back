import { generateToken } from '../utils/tokens';
import { IUserInput } from '../interfaces';
import { UserRepository } from '../repository';
import { UnauthorizedError } from '../errors/customErrors';
import crypto from 'crypto';
import { sendMail } from '../utils/sendEmail';
import { uploadImageToS3 } from '../utils/s3';
import { Payload } from '../interfaces/IPayload';

class UserService {
  static async createUser(user: IUserInput) {
    const userCreated = await UserRepository.createUser(user);
    if (
      user.picture &&
      user.picture !== 'https://cdn-icons-png.flaticon.com/512/5249/5249427.png'
    ) {
      const base64Image = user.picture.split(',')[1];
      const buffer = Buffer.from(base64Image, 'base64');
      const uploadedImage = await uploadImageToS3(userCreated._id, buffer, 'image/jpeg');
      userCreated.urlImage = uploadedImage;
      userCreated.save();
    }
    return userCreated;
  }

  static async loginUser(
    email: string,
    password: string,
  ): Promise<{ token: string; user: Payload }> {
    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: Payload = {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
      blockUntil: user.blockUntil,
      lastSeenAt: user.lastSeenAt,
      urlImage: user.urlImage,
    };

    const token = generateToken(payload);

    return { token, user: payload };
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await UserRepository.findUserByEmail(email);
    //TODO define if it is secure to show that the user does not exist
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
