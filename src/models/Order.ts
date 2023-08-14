import mongoose, { Model } from 'mongoose';
import { IOrder } from '../interfaces';
import orderSchema from '../schemas/orderSchema';

const OrderModel: Model<IOrder> = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;
