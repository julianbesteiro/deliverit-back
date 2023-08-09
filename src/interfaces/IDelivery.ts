export type Cords = {
  lat: number;
  lng: number;
};

export type ValidStatus = 'pending' | 'on-course' | 'delivered' | 'cancelled';

export interface IDelivery {
  status: ValidStatus;
  packageId: string;
  workerId: string;
  startingLocation: Cords;
  destinationLocation: Cords;
  startingDate: Date;
  resolutionDate: Date;
}

export interface IUser {
  name: string;
  password: string;
  email: string;
}
