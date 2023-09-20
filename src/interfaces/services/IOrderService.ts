import { IOrder } from '../Entities/IOrder';
import { BaseFilters } from '../IFilters';
import { PaginationData } from '../IRepository';

export interface IOrderService {
  getOrder(id: string): Promise<IOrder>;
  getOrders(filters?: BaseFilters): Promise<PaginationData<IOrder>>;
  createOrder(item: IOrder): Promise<IOrder>;
  updateOrder(id: string, item: IOrder): Promise<IOrder>;
  deleteOrder(id: string): Promise<IOrder>;
  patchOrder(orderId: string, updatedFields: Partial<IOrder>): Promise<IOrder | null>;
}
