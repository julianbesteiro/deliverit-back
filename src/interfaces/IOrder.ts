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
