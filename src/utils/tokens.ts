import { sign, verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { CustomError } from '../errors/customErrors';
import config from '../../config/config';

interface Payload {
  id: Types.ObjectId;
}

const generateToken = (payload: Payload): string => {
  const secret = config.jwt.access_token.secret as string;
  const token = sign({ user: { id: payload.id } }, secret, {
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
