import { Model } from 'mongoose';

export interface ISworn {
  alcoholicBeverages: boolean;
  psychoactiveMedication: boolean;
  familyProblem: boolean;
  userId: string;
  swornStatementStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISwornDocument extends ISworn, Document {}

export interface ISwornModel extends Model<ISworn> {}
