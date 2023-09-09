import Order from '../models/Order';
import { IOrder } from '../../src/interfaces/';
import { EntityNotFoundError } from '@/errors/customErrors';

class OrderRepository {
  static async createOrder(order: IOrder) {
    const newOrder = await Order.create(order);
    return newOrder;
  }

  static async getOrders() {
    const allOrders = await Order.find();
    return allOrders;
  }

  static async getOrder(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      const entityName = 'Order';
      throw new EntityNotFoundError(entityName);
    }
    return order;
  }

  static async deleteOrder(orderId: string) {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      const entityName = 'Order';
      throw new EntityNotFoundError(entityName);
    }
    return deletedOrder;
  }

  static async updateOrder(orderId: string, updatedOrder: IOrder) {
    const options = { new: true }; // Devolver el documento actualizado
    const updated = await Order.findByIdAndUpdate(orderId, updatedOrder, options);
    if (!updated) {
      const entityName = 'Order';
      throw new EntityNotFoundError(entityName);
    }
    return updated;
  }

  static async patchOrder(orderId: string, updatedFields: Partial<IOrder>) {
    const options = { new: true }; // Devolver el documento actualizado
    const patched = await Order.findByIdAndUpdate(orderId, updatedFields, options);
    return patched;
  }
}

export { OrderRepository };
