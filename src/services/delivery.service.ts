import { BadUserInputError } from '../errors/customErrors';
import {
  DeliveryRepositoryFilters,
  IDelivery,
  IDeliveryDTO,
  IDeliveryService,
  IDeliveryUpdateInput,
  IOrderForDeliverySchema,
  IRepository,
  PaginationData,
} from '../interfaces';

class DeliveryService implements IDeliveryService {
  constructor(private readonly deliveryRepository: IRepository<IDelivery>) {}
  async getDelivery(id: string): Promise<IDelivery> {
    const delivery = this.deliveryRepository.findById(id);
    return delivery;
  }
  async getDeliveries(filters?: DeliveryRepositoryFilters): Promise<PaginationData<IDelivery>> {
    const deliveries = this.deliveryRepository.findAll(filters);
    return deliveries;
  }
  async createDelivery(deliveryDTO: IDeliveryDTO): Promise<IDelivery | IDelivery[]> {
    const { orders } = deliveryDTO;

    const { data } = await this.getDeliveries({
      userId: deliveryDTO.userId,
    });

    const totalPackagesInDeliveries = data.reduce((acc, delivery) => {
      return acc + (delivery.orderId as IOrderForDeliverySchema).packagesQuantity;
    }, 0);

    const totalOrders = deliveryDTO.orders.reduce((acc, order) => {
      return acc + order.packagesQuantity;
    }, 0);

    if (totalPackagesInDeliveries + totalOrders > 10) {
      throw new BadUserInputError({ message: 'Maximum deliveries exceeded' });
    }

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

  async updateDelivery(id: string, update: IDelivery): Promise<IDelivery> {
    if (update.status === 'delivered') {
      const deliveryUpdated = await this.deliveryRepository.update(id, {
        ...update,
        resolutionDeliveryDate: new Date(),
      });
      return deliveryUpdated;
    }

    if (update.status === 'on-course') {
      const deliveryUpdated = await this.deliveryRepository.update(id, {
        ...update,
        startingDeliveryDate: new Date(),
      });
      return deliveryUpdated;
    }

    if (update.status === 'pending') {
      const deliveryUpdated = await this.deliveryRepository.update(id, {
        ...update,
        startingDeliveryDate: null,
        resolutionDeliveryDate: null,
      });
      return deliveryUpdated;
    }

    const deliveryUpdated = await this.deliveryRepository.update(id, update);

    return deliveryUpdated;
  }

  async canChangeStatus(
    userId: string,
    deliveryId: string,
    input: IDeliveryUpdateInput,
  ): Promise<IDeliveryUpdateInput> {
    const delivery = await this.deliveryRepository.findById(deliveryId);

    if (!delivery) {
      throw new BadUserInputError({ message: 'Delivery not found' });
    }

    if (delivery.status === 'cancelled' || delivery.status === 'delivered') {
      throw new BadUserInputError({ message: 'Delivery cannot be changed' });
    }

    if (delivery.status === 'on-course' && input.status === 'cancelled') {
      throw new BadUserInputError({ message: 'Delivery cannot be changed' });
    }

    if (delivery.status === 'pending' && input.status === 'delivered') {
      throw new BadUserInputError({ message: 'Delivery cannot be changed' });
    }

    if (delivery.status === 'pending' && input.status === 'on-course') {
      const deliveries = await this.getDeliveries({
        status: 'on-course',
        userId: userId,
      });

      if (deliveries.data.length > 0) {
        throw new BadUserInputError({ message: 'Are a delivery in course' });
      }
    }

    return input;
  }

  async deleteDelivery(id: string): Promise<void> {
    const deletedDelivery = this.deliveryRepository.delete(id);
    return deletedDelivery;
  }
}

export default DeliveryService;
