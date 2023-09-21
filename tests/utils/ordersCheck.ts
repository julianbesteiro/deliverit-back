import { IDeliveryForTesting } from '../../src/interfaces';

export const ordersCheck = (orders: Array<IDeliveryForTesting>, keys: number) => {
  expect(Array.isArray(orders)).toEqual(true);

  if (orders.length > 0) {
    orders.forEach((order) => {
      expect(Object.keys(order).length).toEqual(keys);
      if (keys === 2) {
        expect(order).toEqual({
          orderId: expect.any(String),
          address: expect.any(String),
        });
      } else {
        expect(order).toEqual({
          orderId: expect.any(String),
          address: expect.any(String),
          status: expect.any(String),
        });
      }
    });
  }

  const orderIdsArray = Object.values(orders.map((order) => order.orderId));
  const uniqueOrderIdsArray = [...new Set(orderIdsArray)];

  expect(orderIdsArray).toEqual(uniqueOrderIdsArray);
};
