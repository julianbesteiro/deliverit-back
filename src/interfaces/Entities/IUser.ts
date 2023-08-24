export interface IUser {
  name: string;
  lastName: string;
  role: string;
  email: string;
  urlImage: string;
  enabled: boolean;
  lastSeenAt: Date;
}

import { Document, Model } from 'mongoose';

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

export interface IUserModel extends Model<IUserDocument> {
  // Método para validar una dirección de correo electrónico
  validateEmail(email: string): boolean;
}
