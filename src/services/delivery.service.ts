import { BaseFilters, IDelivery, IDeliveryDTO, IDeliveryService, IRepository } from '@/interfaces';

class DeliveryService implements IDeliveryService {
  constructor(private readonly deliveryRepository: IRepository<IDelivery>) {}
  async getDelivery(id: string): Promise<IDelivery> {
    const delivery = this.deliveryRepository.findById(id);
    return delivery;
  }
  async getDeliveries(filters: BaseFilters): Promise<IDelivery[]> {
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

  //eslint-disable-next-line
  async updateDelivery(id: string, delivery: IDelivery): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  async deleteDelivery(id: String): Promise<void> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  async getDeliveriesByUser(filter: BaseFilters): Promise<IDelivery[]> {
    throw new Error('Method not implemented.');
  }
  //eslint-disable-next-line
  async patchDelivery(filter: BaseFilters): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
}

export default DeliveryService;
