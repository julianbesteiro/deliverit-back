import { BadUserInputError } from '../errors/customErrors';
import { BaseFilters, IOrder, IOrderInput, PaginationData } from '../interfaces';
import { OrderRepository } from '../repository';

class OrderService {
  static async getOrder(id: string): Promise<IOrder> {
    return await OrderRepository.getOrder(id);
  }

  static async getOrders(filters?: BaseFilters): Promise<PaginationData<IOrder>> {
    const orders = await OrderRepository.findAll(filters);
    return orders;
  }

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

  static async checkIfOrdersAreValid(orders: IOrderInput[]): Promise<IOrderInput[]> {
    const ordersPromise = orders.map(async (orderInput) => {
      const orderFound = await OrderRepository.getOrder(orderInput.orderId);

      if (!orderFound) {
        throw new BadUserInputError({ message: `Order ${orderInput.orderId} not found` });
      }

      return { orderInput, orderFound };
    });

    const results = await Promise.all(ordersPromise);

    const filteredOrders = results.filter(({ orderFound }) => orderFound.status === 'unassigned');

    const ordersChecked = filteredOrders.map(({ orderInput }) => orderInput);

    return ordersChecked;
  }
}

export { OrderService };
