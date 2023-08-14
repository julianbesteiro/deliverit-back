import { Schema } from 'mongoose';

const orderSchema = new Schema({
  status: {
    type: String,
    default: 'unassigned',
  },

  address: {
    type: String,
    required: true,
  },
  coords: {
    type: Object,
    required: true,
  },
  packagesQuantity: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  recipient: {
    type: String,
  },
  deliveryDate: { type: Date, default: null },
});

export default orderSchema;
