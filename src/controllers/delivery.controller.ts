import { ValidationError } from '@/errors/customErrors';
import { IDelivery, IDeliveryService } from '../interfaces'; // Ajusta la ruta según la estructura de carpetas
import { asyncHandler } from '../utils/asyncHandler'; // Ajusta la ruta según la estructura de carpetas
import { Request, Response } from 'express';

class DeliveryController {
  constructor(private readonly deliveryServices: IDeliveryService) {}

  createDelivery = asyncHandler(async (req: Request, res: Response) => {
    const { body } = req;

    if (!body || Object.keys(body).length === 0) {
      throw new ValidationError('Request body is empty');
    }

    const delivery: IDelivery | null = await this.deliveryServices.createDelivery(body);

    return res.status(201).json({
      message: 'Delivery created',
      data: { orderId: delivery?.orderId, userId: delivery?.userId },
      status: 201,
    });
  });

  getDelivery = asyncHandler(async () => {});

  getDeliveries = asyncHandler(async () => {});

  updateDelivery = asyncHandler(async () => {});

  deleteDelivery = asyncHandler(async () => {});

  getDeliveriesByUser = asyncHandler(async () => {});

  patchDelivery = asyncHandler(async () => {});
}

export { DeliveryController };
