import { IDeliveryForTesting } from '@/interfaces';

export const ordersCheck = (orders: Array<IDeliveryForTesting>) => {
  expect(Array.isArray(orders)).toEqual(true);

  if (orders.length > 0) {
    orders.forEach((order) => {
      expect(Object.keys(order).length).toEqual(2);
      expect(order).toEqual({
        orderId: expect.any(String),
        address: expect.any(String),
      });
    });
  }

  const orderIdsArray = Object.values(orders.map((order) => order.orderId));
  const uniqueOrderIdsArray = [...new Set(orderIdsArray)];

  expect(orderIdsArray).toEqual(uniqueOrderIdsArray);
};
