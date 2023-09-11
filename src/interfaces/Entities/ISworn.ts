import { Model } from 'mongoose';

export interface ISworn {
  alcoholicBeverages: boolean;
  psychoactiveMedication: boolean;
  familyProblem: boolean;
  userId: string;
}

export interface ISwornDocument extends ISworn, Document {}

export interface ISwornModel extends Model<ISworn> {}
