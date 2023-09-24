import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export const swornSchema: Schema = new Schema(
  {
    alcoholicBeverages: {
      type: Boolean,
      required: true,
    },
    psychoactiveMedication: {
      type: Boolean,
      required: true,
    },
    familyProblem: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
    },
    swornStatementStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true, strict: 'throw' },
);
