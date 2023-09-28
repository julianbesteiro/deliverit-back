import { DeliveryRepositoryFilters, IDeliveryUpdateInput, IOrderInput } from '../interfaces';
import { hasDuplicates, validateObjectId } from './validateObjectId';
import { BadUserInputError } from '../errors/customErrors';

export async function validateOrdersInput(orders: IOrderInput[]): Promise<IOrderInput[]> {
  const errors: Error[] = [];
  if (!Array.isArray(orders)) {
    throw new BadUserInputError({ message: 'The input is input is not an array' });
  }

  if (hasDuplicates(orders, 'orderId')) {
    errors.push(new BadUserInputError({ message: 'Duplicate order id' }));
  }

  if (orders.length === 0 || orders.length > 10) {
    errors.push(
      new BadUserInputError({
        message: 'The input is not valid, its length is 0 or greater than 10',
      }),
    );
  }

  orders.forEach((order) => {
    if (!validateObjectId(order.orderId!)) {
      errors.push(new BadUserInputError({ message: `Invalid order id : ${order.orderId}` }));
    }
    if (Object.keys(order).length > 1 || Object.keys(order).length === 0) {
      errors.push(new BadUserInputError({ message: 'Invalid data' }));
    }
    if (Object.keys(order)[0] !== 'orderId') {
      errors.push(new BadUserInputError({ message: 'Status cannot be changed' }));
    }
  });

  if (errors.length > 0) {
    throw errors;
  }

  return orders;
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

  if (filters.page) {
    filters.page = parseInt(filters.page.toString() as string);
    if (filters.page < 0 || typeof filters.page !== 'number' || isNaN(filters.page)) {
      errors.push(new BadUserInputError({ message: 'Page is not valid' }));
    }
  }
  if (filters.userId) {
    if (!validateObjectId(filters.userId)) {
      errors.push(new BadUserInputError({ message: 'User id is not valid' }));
    }
  }

  if (errors.length > 0) {
    throw errors;
  }

  return filters;
}

export const validateDeliveryUpdate = async (
  delivery: IDeliveryUpdateInput,
): Promise<IDeliveryUpdateInput> => {
  const errors: Error[] = [];

  if (typeof delivery !== 'object') {
    errors.push(new BadUserInputError({ message: 'Invalid data' }));
  }

  if (Object.keys(delivery).length === 0) {
    errors.push(new BadUserInputError({ message: 'Invalid data' }));
  }

  const updates = Object.keys(delivery);

  updates.forEach((update) => {
    if (update !== 'status') {
      errors.push(new BadUserInputError({ message: 'Invalid data' }));
    }
  });

  if (
    delivery.status &&
    delivery.status !== 'pending' &&
    delivery.status !== 'delivered' &&
    delivery.status !== 'cancelled' &&
    delivery.status !== 'on-course'
  ) {
    errors.push(new BadUserInputError({ message: 'Status is not valid' }));
  }

  if (errors.length > 0) {
    throw errors;
  }

  return delivery;
};

export function validarFormatoFecha(cadena: string) {
  // Expresión regular para el formato 'AAAA-MM-DD'
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

  // Comprueba si la cadena coincide con el formato
  if (formatoFecha.test(cadena)) {
    return true; // La cadena es válida
  } else {
    return false; // La cadena no es válida
  }
}
