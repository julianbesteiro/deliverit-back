import { IRepository } from '@/interfaces';
import { IDelivery } from '@/interfaces';

class DeliveryService {
  constructor(private readonly deliveryRepository: IRepository<IDelivery>) {}

  public static async getDelivery() {
    return 'getDelivery';
  }
  public static async getDeliveries() {
    return 'getDeliveries';
  }
  public static async createDelivery() {
    return 'createDelivery';
  }
  public static async updateDelivery() {
    return 'updateDelivery';
  }
  public static async deleteDelivery() {
    return 'deleteDelivery';
  }
  public static async getDeliveriesByUser() {
    return 'getDeliveriesByUser';
  }
  public static async patchDelivery() {
    return 'patchDelivery';
  }
}

export default DeliveryService;
