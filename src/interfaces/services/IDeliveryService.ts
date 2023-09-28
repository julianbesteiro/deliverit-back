import { IDelivery } from '../Entities/IDelivery';
import { BaseFilters } from '../IFilters';
import { PaginationData } from '../IRepository';
import { IDeliveryUpdateInput } from '../inputs/IDeliveryInput';

export interface IDeliveryDTO {
  userId: string;
  orders: IDelivery[];
}

export interface IDeliveryService {
  getDelivery(id: string): Promise<IDelivery>;
  getDeliveries(filters?: BaseFilters): Promise<PaginationData<IDelivery>>;
  createDelivery(item: IDeliveryDTO): Promise<IDelivery | IDelivery[]>;
  updateDelivery(id: string, item: IDelivery): Promise<IDelivery>;
  deleteDelivery(id: string): Promise<void>;
  canChangeStatus(
    userId: string,
    deliveryId: string,
    delivery: IDeliveryUpdateInput,
  ): Promise<IDeliveryUpdateInput>;
}
