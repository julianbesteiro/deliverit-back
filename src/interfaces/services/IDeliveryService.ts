import { IDelivery, IOutputCreateDelivery } from '../Entities/IDelivery';
import { BaseFilters } from '../IFilters';
import { PaginationData } from '../IRepository';
import { IDeliveryUpdateInput } from '../inputs/IDeliveryInput';
import { IOrderInput } from '../inputs/IOrderInput';

export interface IDeliveryDTO {
  userId: string;
  orders: IOrderInput[];
}

export interface IDeliveryService {
  getDelivery(id: string): Promise<IDelivery>;
  getDeliveries(filters?: BaseFilters): Promise<PaginationData<IDelivery>>;
  createDelivery(item: IDeliveryDTO): Promise<IOutputCreateDelivery>;
  updateDelivery(id: string, item: IDeliveryUpdateInput): Promise<IDelivery>;
  deleteDelivery(id: string, userId: string): Promise<void>;
  canChangeStatus(
    userId: string,
    deliveryId: string,
    delivery: IDeliveryUpdateInput,
  ): Promise<IDeliveryUpdateInput>;
}
