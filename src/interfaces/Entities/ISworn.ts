import { Model } from 'mongoose';
import { IUserDocument } from './IUser';

export interface ISworn {
  alcoholicBeverages: boolean;
  psychoactiveMedication: boolean;
  familyProblem: boolean;
  userId: string;
  swornStatementStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SwornServiceResponse {
  sworn: ISworn;
  updatedUser: IUserDocument;
}

export interface ISwornDocument extends ISworn, Document {}

export interface ISwornModel extends Model<ISworn> {}
