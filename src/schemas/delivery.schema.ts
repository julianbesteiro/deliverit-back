import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export const deliverySchema: Schema = new Schema(
  {
    destinationLocation: {
      type: Object,
    },
    orderId: {
      type: ObjectId,
      required: true,
      ref: 'Order',
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
    startingDeliveryDate: { type: Date, default: null },
    resolutionDeliveryDate: { type: Date, default: null },
  },
  { timestamps: true, strict: 'throw' },
);
