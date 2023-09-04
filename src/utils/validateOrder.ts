import { BadUserInputError } from '@/errors/customErrors';
import { validateCalendarDate } from './validateDate';

export interface IOrderInput {
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
  packagesQuantity: number;
  weight: number;
  recipient: string;
  deliveryDate: string;
}

export async function validateOrderInput(orderData: IOrderInput) {
  const errors: Error[] = [];

  if (!orderData || Object.keys(orderData).length === 0) {
    errors.push(new BadUserInputError({ message: 'Order data is empty' }));
  }

  if (!orderData.address) {
    errors.push(new BadUserInputError({ message: 'Address is required' }));
  }

  if (!orderData.coords?.lat || !orderData.coords?.lng) {
    errors.push(new BadUserInputError({ message: 'Destination location is not valid' }));
  }

  if (typeof orderData.coords.lat !== 'number' || typeof orderData.coords.lng !== 'number') {
    errors.push(new BadUserInputError({ message: 'Destination location format is not valid' }));
  }

  if (typeof orderData.address !== 'string') {
    errors.push(new BadUserInputError({ message: 'Address format is not valid' }));
  }

  if (typeof orderData.packagesQuantity !== 'number') {
    errors.push(new BadUserInputError({ message: 'Packages quantity format is not valid' }));
  }

  if (typeof orderData.weight !== 'number') {
    errors.push(new BadUserInputError({ message: 'Weight format is not valid' }));
  }

  if (typeof orderData.recipient !== 'string') {
    errors.push(new BadUserInputError({ message: 'Recipient format is not valid' }));
  }

  if (typeof orderData.deliveryDate !== 'string') {
    errors.push(new BadUserInputError({ message: 'Date format is not valid' }));
  }

  if (typeof orderData.deliveryDate === 'string') {
    validateCalendarDate(orderData.deliveryDate);
  }

  if (errors.length > 0) {
    console.log('errors', errors);

    throw errors;
  }
  return orderData;
}
