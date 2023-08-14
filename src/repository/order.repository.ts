/* import { Request, Response } from 'express';
import { updateOrderService } from '../services/order.service';

export const updateOrder = async (req: Request, res: Response) => {
  try {
    await updateOrderService(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar la orden' });
  }
}; */

import Order from '../models/Order';
import { db } from '../../config/db';
import { IOrder } from '../interfaces';

class OrderRepository {
  static async orderRepositoryTest(maxOrders: number) {
    try {
      await db.connect();

      const allOrders = await Order.find().limit(maxOrders);

      db.disconnect();

      console.log('test repository');
      return allOrders;
    } catch (error) {
      console.log(error);
    }
  }

  static async createOrder(order: IOrder) {
    try {
      await db.connect();
      const newOrder = await Order.create(order);
      db.disconnect();

      return newOrder;
    } catch (error) {
      console.log('ESTE ES EL ERROR DE LA DB---->', error);
      throw error;
    }
  }
}

export { OrderRepository };
