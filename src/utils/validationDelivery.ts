// validationDelivery.ts

import { DeliveryRepositoryFilters, IDelivery } from '@/interfaces';
import { validateObjectId } from './validateObjectId';
import { BadUserInputError } from '@/errors/customErrors';

export async function validateDeliveryInput(deliveryData: IDelivery): Promise<IDelivery> {
  const errors: Error[] = [];

  if (!deliveryData || Object.keys(deliveryData).length === 0) {
    errors.push(new BadUserInputError({ message: 'Delivery data is empty' }));
  }

  if (!deliveryData.orderId || !validateObjectId(deliveryData.orderId)) {
    errors.push(new BadUserInputError({ message: 'Order id is not valid' }));
  }

  if (!deliveryData.userId || !validateObjectId(deliveryData.userId)) {
    errors.push(new BadUserInputError({ message: 'User id is not valid' }));
  }

  if (!deliveryData.destinationLocation) {
    errors.push(new BadUserInputError({ message: 'Destination location is required' }));
  }

  if (!deliveryData.destinationLocation?.lat || !deliveryData.destinationLocation?.lng) {
    errors.push(new BadUserInputError({ message: 'Destination location is not valid' }));
  }

  if (
    typeof deliveryData.destinationLocation.lat !== 'number' ||
    typeof deliveryData.destinationLocation.lng !== 'number'
  ) {
    errors.push(new BadUserInputError({ message: 'Destination location is not valid' }));
  }

  if (errors.length > 0) {
    throw errors;
  }

  return deliveryData;
}

export async function validateDeliveryFilters(
  filters: DeliveryRepositoryFilters,
): Promise<DeliveryRepositoryFilters> {
  const errors: Error[] = [];

  if (
    filters.status &&
    filters.status !== 'pending' &&
    filters.status !== 'delivered' &&
    filters.status !== 'cancelled' &&
    filters.status !== 'on-course'
  ) {
    errors.push(new BadUserInputError({ message: 'Status is not valid' }));
  }

  if (filters.limit) {
    filters.limit = parseInt(filters.limit.toString() as string);
    if (isNaN(filters.limit)) {
      errors.push(new BadUserInputError({ message: 'Limit must be a number' }));
    }
    if (filters.limit < 0) {
      errors.push(new BadUserInputError({ message: 'Limit is not valid' }));
    }
  }

  if (filters.page && filters.page < 0) {
    errors.push(new BadUserInputError({ message: 'Page is not valid' }));
  }

  if (errors.length > 0) {
    throw errors;
  }

  return filters;
}
