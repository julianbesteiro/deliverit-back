import { BaseFilters, IOrder, IOrderService, IRepository } from '../../src/interfaces/';

class OrderService implements IOrderService {
  constructor(private readonly orderRepository: IRepository<IOrder>) {}
  //eslint-disable-next-line
  getOrder(id: String): Promise<IOrder> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  getOrders(): Promise<IOrder[]> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  createOrder(order: IOrder): Promise<IOrder> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  updateOrder(id: string, order: IOrder): Promise<IOrder> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  deleteOrder(id: String): Promise<void> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  patchOrder(filter: BaseFilters): Promise<IOrder> {
    throw new Error('Method not implemented.');
  }
}

export default OrderService;
