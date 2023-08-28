import { Model } from 'mongoose';

export interface IOrder extends Document {
  status: string;
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
  packagesQuantity: number;
  weight: number;
  recipient: string;
  deliveryDate: Date;
}

export interface IOrderDocument extends IOrder, Document {}

export interface IOrderModel extends Model<IOrder> {}
