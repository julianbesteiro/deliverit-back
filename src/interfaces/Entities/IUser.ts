export interface IUser {
  name: string;
  lastName: string;
  role: string;
  email: string;
  urlImage: string;
  enabled: boolean;
  blockUntil?: Date | null;
  numberOfPacakagesPerDay: number;
  lastSeenAt: Date;
}

export interface IUserUpdateOutput {
  user: Payload;
  token: string;
}

export interface IUserInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  urlImage?: string;
  picture: string;
  enabled?: boolean;
  blockUntil?: Date | null;
}

import { Document, Model } from 'mongoose';
import { Payload } from '../IPayload';

export interface IUserDocument extends IUser, Document {
  // Propiedades que no están en el esquema original para un usuario
  password: string;
  passwordReset?: {
    token: string;
    expiration: Date;
  };

  // Método para verificar la contraseña
  checkPassword(password: string): Promise<boolean>;
}

export interface IWorker {
  status: string;
  workerId: number;
  percentage: number;
}

export interface IUserModel extends Model<IUserDocument> {
  // Método para validar una dirección de correo electrónico
  validateEmail(email: string): boolean;
}
