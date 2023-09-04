import { BadUserInputError } from '@/errors/customErrors';
import { IOrder } from '@/interfaces';
import DeliveryModel from '@/models/Delivery';
import OrderModel from '@/models/Order';
import UserModel from '@/models/User';
import { ObjectId } from 'mongodb';

class AdminRepository {
  static async newOrder(order: IOrder) {
    const orderCreated = await OrderModel.create(order);
    return orderCreated;
  }

  // static async dataByDate(date: Date, nextDay: Date) {
  //   const availableOrders = await OrderModel.find({ deliveryDate: date });

  //   const deliveredOrders = await DeliveryModel.find({
  //     $and: [{ _id: { $in: availableOrders.map((order) => order._id) } }, { deliveryDate: date }],
  //   });

  //   const availableWorkers = await UserModel.find({ createdDate: { $lte: nextDay } });

  //   const activeWorkersOrders = await DeliveryModel.find({
  //     $and: [
  //       { userId: { $in: availableWorkers.map((worker) => worker._id) } },
  //       { deliveryDate: date },
  //     ],
  //   });

  //   return { availableOrders, deliveredOrders, availableWorkers, activeWorkersOrders };
  // }

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

  // static async deliveriesByDate(day: number, month: number, year: number) {
  //   const deliveredDeliveries = await DeliveryModel.find({
  //     $expr: {
  //       $and: [
  //         { $eq: [{ $year: '$deliveryDate' }, year] },
  //         { $eq: [{ $month: '$deliveryDate' }, month] },
  //         { $eq: [{ $dayOfMonth: '$deliveryDate' }, day] },
  //       ],
  //     },
  //   });

  //   return deliveredDeliveries;
  // }

  static async availableWorkers(nextDay: Date) {
    const availableWorkers = await UserModel.find({ createdAt: { $lte: nextDay } });

    return availableWorkers;
  }

  static async deliveriesByDate(day: number, month: number, year: number) {
    const deliveriesByDate = await DeliveryModel.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$resolutionDate' }, year] },
          { $eq: [{ $month: '$resolutionDate' }, month] },
          { $eq: [{ $dayOfMonth: '$resolutionDate' }, day] },
        ],
      },
    });

    return deliveriesByDate;
  }

  // static async workerDataByDate(date: Date, nextDay: Date) {
  //   const availableWorkers = await UserModel.find({ createdDate: { $lte: nextDay } });

  //   const activeWorkersOrders = await DeliveryModel.find({
  //     $and: [
  //       { userId: { $in: availableWorkers.map((worker) => worker._id) } },
  //       { resolutionDate: date },
  //     ],
  //   });

  //   return { availableWorkers, activeWorkersOrders };
  // }

  static async workerStatus(id: ObjectId) {
    const workerData = await UserModel.findOne({ _id: id });

    if (!workerData) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    const newStatus = !workerData.enabled;

    await UserModel.updateOne({ _id: id }, { enabled: newStatus });

    const updatedUser = await UserModel.findOne({ _id: id });

    return updatedUser;
  }

  static async orderToRemove(id: ObjectId) {
    const deletionResult = await OrderModel.deleteOne({ _id: id });

    if (deletionResult.deletedCount === 1) {
      return true;
    } else {
      return false;
    }
  }

  // static async workerDataById(id: ObjectId) {
  //   const workerData = await UserModel.findOne({ _id: id });

  //   const deliveredOrders = await DeliveryModel.find({
  //     $and: [{ userId: id }, { status: 'delivered' }],
  //   });

  //   const pendingOrders = await DeliveryModel.find({
  //     $and: [
  //       { userId: id },
  //       {
  //         $or: [{ status: 'pending' }, { status: 'onCourse' }],
  //       },
  //     ],
  //   });

  //   return { workerData, deliveredOrders, pendingOrders };
  // }

  static async deliveryDataById(id: ObjectId) {
    const workerData = await UserModel.findOne({ _id: id });

    if (!workerData) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    const workerOrders = await DeliveryModel.find({
      userId: id,
    });

    return { workerOrders, workerData };
  }

  static async orderDataByDate(date: Date) {
    const ordersSearched = await OrderModel.find({ deliveryDate: date });

    return ordersSearched;
  }
}

export default AdminRepository;
