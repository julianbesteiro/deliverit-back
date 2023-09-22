import { sign, verify } from 'jsonwebtoken';
import { CustomError } from '../errors/customErrors';
import config from '../../config/config';
import { Payload } from '../interfaces/IPayload';

const generateToken = (payload: Payload): string => {
  const secret = config.jwt.access_token.secret as string;
  const token = sign({ user: payload }, secret, {
    expiresIn: '20d',
  });
  if (!token) throw new CustomError('Token is expired or invalid', 401);
  return token;
};

const validateToken = (token: string) => {
  const user = verify(token, config.jwt.access_token.secret as string);
  return user;
};

export { generateToken, validateToken };
