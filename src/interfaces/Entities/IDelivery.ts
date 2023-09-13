import { Model } from 'mongoose';
import { IOrder } from './IOrder';

export type Cords = {
  lat: number;
  lng: number;
};

export type ValidStatus = 'pending' | 'on-course' | 'delivered' | 'cancelled';

export interface IDelivery {
  _id?: string;
  status?: ValidStatus;
  orderId?: string;
  userId?: string;
  startingLocation?: Cords;
  destinationLocation?: Cords;
  startingDeliveryDate?: Date | string | null;
  resolutionDeliveryDate?: Date | string | null;
  createdAt?: string;
  updatedAt?: string;
  order?: IOrder;
}

export interface IDeliveryForTesting {
  orderId: number;
  address: string;
}

export interface IDeliveryDocument extends IDelivery, Document {}

export interface IDeliveryModel extends Model<IDelivery> {}
