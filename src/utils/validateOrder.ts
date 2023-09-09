import { BadUserInputError } from '@/errors/customErrors';
import { validateDate } from './validateDate';
import { IOrder } from '@/interfaces';

export async function validateOrderInput(orderData: IOrder) {
  const errors: Error[] = [];

  if (!orderData || Object.keys(orderData).length === 0) {
    errors.push(new BadUserInputError({ message: 'Order data is not valid' }));
  }

  if (!orderData.address || typeof orderData.address !== 'string') {
    errors.push(new BadUserInputError({ message: 'Address is not valid' }));
  }

  if (
    !orderData.coords?.lat ||
    !orderData.coords?.lng ||
    typeof orderData.coords.lat !== 'number' ||
    typeof orderData.coords.lng !== 'number'
  ) {
    errors.push(new BadUserInputError({ message: 'Destination location is not valid' }));
  }

  if (!orderData.packagesQuantity || typeof orderData.packagesQuantity !== 'number') {
    errors.push(new BadUserInputError({ message: 'Packages quantity is not valid' }));
  }

  if (!orderData.weight || typeof orderData.weight !== 'number') {
    errors.push(new BadUserInputError({ message: 'Weight is not valid' }));
  }

  if (!orderData.recipient || typeof orderData.recipient !== 'string') {
    errors.push(new BadUserInputError({ message: 'Recipient is not valid' }));
  }

  if (!orderData.deliveryDate || typeof orderData.deliveryDate !== 'string') {
    errors.push(new BadUserInputError({ message: 'Delivery date is not valid' }));
  }

  if (typeof orderData.deliveryDate === 'string') {
    validateDate(orderData.deliveryDate);
  }

  if (errors.length > 0) {
    console.log('errors', errors);

    throw errors;
  }
  return orderData;
}
