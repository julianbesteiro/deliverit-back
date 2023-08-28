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


export interface IOrderDocument extends IOrder, Document {}

export interface IOrderModel extends Model<IOrder> {}
