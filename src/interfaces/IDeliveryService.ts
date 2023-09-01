import { IDelivery } from './Entities/IDelivery';
import { BaseFilters } from './IFilters';

export interface IDeliveryService {
  getDelivery(id: string): Promise<IDelivery | null>;
  getDeliveries(filters?: BaseFilters): Promise<IDelivery[] | null>;
  createDelivery(item: IDelivery[]): Promise<IDelivery | IDelivery[] | null>;
  updateDelivery(id: string, item: IDelivery): Promise<IDelivery | null>;
  deleteDelivery(id: string): Promise<void>;
  getDeliveriesByUser(filters?: BaseFilters): Promise<IDelivery[] | null>;
  patchDelivery(filters?: BaseFilters): Promise<IDelivery | null>;
}
