import { IDelivery, IDeliveryDocument } from '@/interfaces';
import { IDeliveryModel } from '@/interfaces';
import { UpdateResult } from 'mongodb';

export interface IDeliveryRepository {
  create(delivery: IDelivery): Promise<IDelivery | null>;
  findAll(): Promise<IDelivery[] | null>;
  findById(id: string): Promise<IDelivery | null>;
  update(id: string, delivery: IDelivery): Promise<IDelivery | null>;
  delete(id: string): Promise<void>;
}

class DeliveryRepository {
  constructor(private readonly deliveryModel: IDeliveryModel) {}

  async create(delivery: IDelivery): Promise<IDelivery | null> {
    const deliveryCreated = await this.deliveryModel.create(delivery);
    return deliveryCreated;
  }

  async findAll(): Promise<IDelivery[] | null> {
    const deliveries = await this.deliveryModel.find();
    return deliveries;
  }

  async findById(id: string): Promise<IDelivery | null> {
    const delivery = await this.deliveryModel.findById(id);
    return delivery;
  }

  async update(id: string, delivery: IDelivery): Promise<IDelivery | null> {
    // Usa el tipo UpdateResult correcto aquí
    const deliveryUpdated: UpdateResult<IDeliveryDocument> = await this.deliveryModel.updateOne(
      { where: { id } },
      { delivery },
    );

    if (deliveryUpdated.modifiedCount === 1) {
      // Obtiene y devuelve el documento actualizado
      const updatedDelivery = await this.deliveryModel.findById(id);
      return updatedDelivery;
    } else {
      return null; // Maneja el fallo de la actualización si es necesario
    }
  }

  async delete(id: string): Promise<void> {
    await this.deliveryModel.deleteOne({ where: { id } });
  }
}

export default DeliveryRepository;
