import { BadUserInputError } from '@/errors/customErrors';
import {
  DeliveryRepositoryFilters,
  IDelivery,
  IDeliveryService,
  PaginationData,
} from '@/interfaces'; // Ajusta la ruta según la estructura de carpetas
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

interface PaginationDataResponse extends DataReponse {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  prevPage: string | null;
  nextPage: string | null;
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

  getDeliveries = asyncHandler(
    async (req: Request, res: Response<PaginationDataResponse | DataReponse>) => {
      const { query } = req;

      let filters: DeliveryRepositoryFilters = query;

      filters = await validateDeliveryFilters(filters);

      const deliveries: PaginationData<IDelivery> = await this.deliveryServices.getDeliveries(
        filters,
      );

      return res.status(200).json({
        message: 'Deliveries found',
        page: deliveries.page,
        totalPages: deliveries.totalPages,
        data: deliveries.data,
        totalItems: deliveries.totalItems,
        itemsPerPage: deliveries.data.length,
        prevPage: deliveries.page > 1 ? `/deliveries?page=${deliveries.page - 1}` : null,
        nextPage:
          deliveries.page < deliveries.totalPages
            ? `/deliveries?page=${deliveries.page + 1}`
            : null,
        status: 200,
      });
    },
  );

  updateDelivery = asyncHandler(async () => {});

  deleteDelivery = asyncHandler(async () => {});

  getDeliveriesByUser = asyncHandler(async () => {});

  patchDelivery = asyncHandler(async () => {});
}

export { DeliveryController };
