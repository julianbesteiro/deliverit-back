import { IOrder } from '../interfaces';
import { OrderRepository } from '../repository';

class OrderService {
  static async orderServiceTest(id: number) {
    try {
      //logica random

      const maxOrders = id + 100;

      const orderRepositoryData = await OrderRepository.orderRepositoryTest(maxOrders);
      console.log('test service');

      return orderRepositoryData;
    } catch (error) {
      console.log(error);
    }
  }

  static async createOrder(order: IOrder) {
    return await OrderRepository.createOrder(order);
  }
}

export { OrderService };
