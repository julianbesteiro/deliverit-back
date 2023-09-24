import { sign, verify } from 'jsonwebtoken';
import { CustomError } from '../errors/customErrors';
import config from '../../config/config';
import { Payload } from '../interfaces/IPayload';

const getSecondsUntilMidnight = (): number => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return (midnight.getTime() - now.getTime()) / 1000;
};

const generateToken = (payload: Payload): string => {
  const secret = config.jwt.access_token.secret as string;
  const expirationTime = Math.floor(getSecondsUntilMidnight());

  try {
    const token = sign({ user: payload }, secret, {
      expiresIn: expirationTime,
    });

    return token;
  } catch (error) {
    throw new CustomError('Error generating token', 500);
  }
};

const validateToken = (token: string) => {
  const user = verify(token, config.jwt.access_token.secret as string);
  return user;
};

export { generateToken, validateToken };
