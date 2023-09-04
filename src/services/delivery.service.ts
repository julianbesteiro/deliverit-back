import {
  BaseFilters,
  IDelivery,
  IDeliveryDTO,
  IDeliveryService,
  IRepository,
  PaginationData,
} from '@/interfaces';

class DeliveryService implements IDeliveryService {
  constructor(private readonly deliveryRepository: IRepository<IDelivery>) {}
  async getDelivery(id: string): Promise<IDelivery> {
    const delivery = this.deliveryRepository.findById(id);
    return delivery;
  }
  async getDeliveries(filters: BaseFilters): Promise<PaginationData<IDelivery>> {
    const deliveries = this.deliveryRepository.findAll(filters);
    return deliveries;
  }
  async createDelivery(deliveryDTO: IDeliveryDTO): Promise<IDelivery | IDelivery[]> {
    const { orders } = deliveryDTO;

    const createPromises = orders.map(async (order) => {
      const deliveryCreated = await this.deliveryRepository.create({
        orderId: order.orderId,
        userId: deliveryDTO.userId,
      });
      return deliveryCreated;
    });

    const deliveriesCreated = await Promise.all(createPromises);

    return deliveriesCreated.length === 1 ? deliveriesCreated[0] : deliveriesCreated;
  }

  async updateDelivery(delivery: IDelivery): Promise<IDelivery> {
    const updatedDelivery = this.deliveryRepository.update(delivery);
    return updatedDelivery;
  }

  async deleteDelivery(id: string): Promise<void> {
    const deletedDelivery = this.deliveryRepository.delete(id);
    return deletedDelivery;
  }
  //eslint-disable-next-line
  async getDeliveriesByUser(filter: BaseFilters): Promise<IDelivery[]> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  async patchDelivery(delivery: IDelivery): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
}

export default DeliveryService;
