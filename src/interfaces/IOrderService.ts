import { IOrder } from './Entities/IOrder';
import { BaseFilters } from './IFilters';

export interface IOrderService {
  getOrder(id: string): Promise<IOrder>;
  getOrders(filters?: BaseFilters): Promise<IOrder[]>;
  createOrder(item: IOrder): Promise<IOrder>;
  updateOrder(id: string, item: IOrder): Promise<IOrder>;
  deleteOrder(id: string): Promise<void>;
  patchOrder(filters?: BaseFilters): Promise<IOrder>;
}