import { IDelivery } from './Entities/IDelivery';
import { BaseFilters } from './IFilters';

export interface IDeliveryService {
  getDelivery(id: string): Promise<IDelivery>;
  getDeliveries(filters?: BaseFilters): Promise<IDelivery[]>;
  createDelivery(item: IDelivery): Promise<IDelivery>;
  updateDelivery(id: string, item: IDelivery): Promise<IDelivery>;
  deleteDelivery(id: string): Promise<void>;
  getDeliveriesByUser(filters?: BaseFilters): Promise<IDelivery[]>;
  patchDelivery(filters?: BaseFilters): Promise<IDelivery>;
}
