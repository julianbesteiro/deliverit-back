import { ObjectId } from 'mongodb';
import { Document, Model } from 'mongoose';

export type Cords = {
  lat: number;
  lng: number;
};

export type ValidStatus = 'pending' | 'on-course' | 'delivered' | 'cancelled';

export interface IDelivery {
  status?: ValidStatus;
  orderId: ObjectId;
  userId: ObjectId;
  startingLocation?: Cords;
  destinationLocation?: Cords;
  startingDate?: Date;
  resolutionDate?: Date;
}

export interface IDeliveryDocument extends IDelivery, Document {}

export interface IDeliveryModel extends Model<IDelivery> {}
