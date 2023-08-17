import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export const deliverySchema: Schema = new Schema(
  {
    destinationLocation: {
      type: Object,
      required: true,
    },
    orderId: {
      type: ObjectId,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    startingLocation: {
      type: Object,
    },
    startingDate: { type: Date, default: null },
    resolutionDate: { type: Date, default: null },
  },
  { timestamps: true },
);
