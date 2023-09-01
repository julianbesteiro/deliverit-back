import { BaseFilters, IDelivery, IDeliveryService, IRepository } from '@/interfaces';

class DeliveryService implements IDeliveryService {
  constructor(private readonly deliveryRepository: IRepository<IDelivery>) {}
  getDelivery(id: string): Promise<IDelivery | null> {
    const delivery = this.deliveryRepository.findById(id);
    return delivery;
  }
  getDeliveries(filters: BaseFilters): Promise<IDelivery[] | null> {
    const deliveries = this.deliveryRepository.findAll(filters);
    return deliveries;
  }
  createDelivery(delivery: IDelivery | IDelivery[]): Promise<IDelivery | IDelivery[] | null> {
    const deliveryCreated = this.deliveryRepository.create(delivery);
    return deliveryCreated;
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
