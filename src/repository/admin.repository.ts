import { IDeliveryForOrderPopulation } from '@/interfaces';
import { ValidationError } from '../errors/customErrors';
import DeliveryModel from '../models/Delivery';
import OrderModel from '../models/Order';
import UserModel from '../models/User';
import { ObjectId } from 'mongodb';

class AdminRepository {
  static async availableOrdersByDate(day: number, month: number, year: number) {
    const availableOrders = await OrderModel.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$deliveryDate' }, year] },
          { $eq: [{ $month: '$deliveryDate' }, month] },
          { $eq: [{ $dayOfMonth: '$deliveryDate' }, day] },
        ],
      },
    });

    return availableOrders;
  }

  static async availableWorkers(nextDay: Date) {
    const availableWorkers = await UserModel.find({ createdAt: { $lte: nextDay } });

    return availableWorkers;
  }

  static async deliveriesByDate(day: number, month: number, year: number) {
    const deliveriesByDate = await DeliveryModel.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$resolutionDeliveryDate' }, year] },
          { $eq: [{ $month: '$resolutionDeliveryDate' }, month] },
          { $eq: [{ $dayOfMonth: '$resolutionDeliveryDate' }, day] },
        ],
      },
    });

    return deliveriesByDate;
  }

  static async workerStatus(id: ObjectId) {
    const workerData = await UserModel.findOne({ _id: id });

    if (!workerData) {
      throw new ValidationError('Invalid id');
    }

    const newStatus = !workerData.enabled;

    await UserModel.updateOne({ _id: id }, { enabled: newStatus });

    const updatedUser = await UserModel.findOne({ _id: id });

    return updatedUser;
  }

  static async deliveryDataById(id: ObjectId) {
    const workerData = await UserModel.findOne({ _id: id });

    if (!workerData) {
      throw new ValidationError('Invalid id');
    }

    const workerOrders: IDeliveryForOrderPopulation | IDeliveryForOrderPopulation[] =
      await DeliveryModel.find({
        userId: id,
      }).populate('orderId');

    return { workerOrders, workerData };
  }

  static async orderDataByDate(date: Date) {
    const ordersSearched = await OrderModel.find({ deliveryDate: date });

    return ordersSearched;
  }
}

export default AdminRepository;
