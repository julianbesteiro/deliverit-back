//import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

/* export type Coordenates = {
  lat: number;
  lng: number;
};
 */
export type ValidStatuses = 'assigned' | 'unassigned';

export interface IOrder {
  status?: ValidStatuses;
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

export interface IOrderForDeliverySchema {
  _id: string | undefined;
  status?: ValidStatuses;
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
  packagesQuantity: number;
  weight: number;
  recipient: string;
  deliveryDate: Date;
  __v: number;
}

export interface IOrderDocument extends IOrder, Document {}

export interface IOrderModel extends Model<IOrder> {}
