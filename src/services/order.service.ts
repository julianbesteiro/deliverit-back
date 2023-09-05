import { IOrder } from '../../src/interfaces/';
import { OrderRepository } from '../repository';

class OrderService {
  
  static async createOrder(order: IOrder) {
    return await OrderRepository.createOrder(order);
  }

  static async getOrders(): Promise<IOrder[]>  {
    return await OrderRepository.getOrders();
  }

  static async getOrder(orderId: string) {
    return await OrderRepository.getOrder(orderId);
  }

  static async deleteOrder(orderId: string) {
    return await OrderRepository.deleteOrder(orderId);
  }

  static async updateOrder(orderId: string, updatedOrder: IOrder) {
    return await OrderRepository.updateOrder(orderId, updatedOrder);
  }

  static async patchOrder(orderId: string, updatedFields: Partial<IOrder>) {
    return await OrderRepository.patchOrder(orderId, updatedFields);
  }


/*   //eslint-disable-next-line
  getOrder(id: String): Promise<IOrder> {
    throw new Error('Method not implemented.');
  }*/
}

export { OrderService };