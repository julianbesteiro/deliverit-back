import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

const deliverySchema = new Schema({
  status: {
    type: String,
    default: 'pending',
  },
  packageId: {
    type: ObjectId,
    required: true,
  },
  workerId: {
    type: ObjectId,
    required: true,
  },
  startingLocation: {
    type: Object,
  },
  destinationLocation: {
    type: Object,
    required: true,
  },
  startingDate: { type: Date, default: null },
  resolutionDate: { type: Date, default: null },
});

export default deliverySchema;
