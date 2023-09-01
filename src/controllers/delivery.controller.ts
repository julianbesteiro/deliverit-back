import { BadUserInputError } from '@/errors/customErrors';
import { DeliveryRepositoryFilters, IDelivery, IDeliveryService } from '@/interfaces'; // Ajusta la ruta según la estructura de carpetas
import { asyncHandler } from '@/utils/asyncHandler'; // Ajusta la ruta según la estructura de carpetas
import { Request, Response } from 'express';
import { validateObjectId } from '@/utils/validateObjectId';
import { validateDeliveryFilters, validateDeliveryInput } from '@/utils/validationDelivery';
import { RequestExpress } from '@/interfaces/IRequestExpress';

interface DataReponse {
  message: string;
  data: IDelivery | IDelivery[] | null;
  status: number;
}

class DeliveryController {
  constructor(private readonly deliveryServices: IDeliveryService) {}

  createDelivery = asyncHandler(
    async (req: RequestExpress | Request, res: Response<DataReponse>) => {
      const { body } = req;
      const { user } = req as RequestExpress;

      const orders: IDelivery[] = body;

      //Validations
      const ordersValidate = await validateDeliveryInput(orders);

      const deliveries: IDelivery | IDelivery[] = await this.deliveryServices.createDelivery({
        userId: user.id,
        orders: ordersValidate,
      });

      return res.status(201).json({
        message: 'Deliveries created',
        data: deliveries,
        status: 201,
      });
    },
  );

  getDelivery = asyncHandler(async (req: Request, res: Response<DataReponse>) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    const delivery: IDelivery | null = await this.deliveryServices.getDelivery(id);

    return res.status(200).json({
      message: 'Delivery found',
      data: delivery,
      status: 200,
    });
  });

  getDeliveries = asyncHandler(async (req: Request, res: Response<DataReponse>) => {
    const { query } = req;

    let filters: DeliveryRepositoryFilters = query;

    if (filters) {
      filters = await validateDeliveryFilters(filters);
    }

    const deliveries: IDelivery[] | null = await this.deliveryServices.getDeliveries(filters);

    return res.status(200).json({
      message: 'Deliveries found',
      data: deliveries,
      status: 200,
    });
  });

  updateDelivery = asyncHandler(async () => {});

  deleteDelivery = asyncHandler(async () => {});

  getDeliveriesByUser = asyncHandler(async () => {});

  patchDelivery = asyncHandler(async () => {});
}

export { DeliveryController };
