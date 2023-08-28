import { BaseFilters, IDelivery, IDeliveryService, IRepository } from '@/interfaces';

class DeliveryService implements IDeliveryService {
  constructor(private readonly deliveryRepository: IRepository<IDelivery>) {}
  //eslint-disable-next-line
  getDelivery(id: String): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  getDeliveries(): Promise<IDelivery[]> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  createDelivery(delivery: IDelivery): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  updateDelivery(id: string, delivery: IDelivery): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  deleteDelivery(id: String): Promise<void> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  getDeliveriesByUser(filter: BaseFilters): Promise<IDelivery[]> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  patchDelivery(filter: BaseFilters): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
}

export default DeliveryService;
