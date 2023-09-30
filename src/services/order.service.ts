import { BaseFilters, IOrder, IOrderInput, PaginationData } from '../interfaces';
import { OrderRepository } from '../repository';

class OrderService {
  static async getOrder(id: string): Promise<IOrder> {
    return await OrderRepository.getOrder(id);
  }

  //----------------------------------------------------------------------------------------------

  static async getOrders(filters?: BaseFilters): Promise<PaginationData<IOrder>> {
    const orders = await OrderRepository.findAll(filters);
    return orders;
  }

   //----------------------------------------------------------------------------------------------


/*   static async getOrders(filters?: BaseFilters | undefined): Promise<PaginationData<IOrder>> {
    return await OrderRepository.getOrders(filters);
  } */
  static async createOrder(order: IOrder): Promise<IOrder> {
    return await OrderRepository.createOrder(order);
  }
  static async updateOrder(id: string, item: IOrder): Promise<IOrder> {
    return await OrderRepository.updateOrder(id, item);
  }
  static async deleteOrder(id: string): Promise<IOrder> {
    return await OrderRepository.deleteOrder(id);
  }
  static async patchOrder(orderId: string, updatedFields: Partial<IOrder>): Promise<IOrder | null> {
    return await OrderRepository.patchOrder(orderId, updatedFields);
  }
  static async updateOrderStatus(orders: IOrderInput[], status: string): Promise<IOrder[]> {
    return await OrderRepository.updateOrderStatus(orders, status);
  }
}

export { OrderService };
