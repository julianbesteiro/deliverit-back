import AdminService from '@/services/admin.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { Request, Response } from 'express';
import { validateOrderInput } from '@/utils/validateOrder';
import { validateDate } from '@/utils/validateDate';
import { BadUserInputError } from '@/errors/customErrors';
import { validateObjectId } from '@/utils/validateObjectId';

class AdminController {
  public static workerDataByDate = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.params;

    const convertedDate = await validateDate(date);

    const workerDataByDate = await AdminService.workerDataByDate(convertedDate);

    return res.status(200).json({
      message: 'Successful data request',
      data: workerDataByDate,
      status: 200,
    });
  });

  public static workerDataById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const objectIdValidation = validateObjectId(id);

    if (objectIdValidation === false) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    const workerDataById = await AdminService.workerDataById(id);

    return res.status(200).json({
      message: 'Successful data request',
      data: workerDataById,
      status: 200,
    });
  });

  public static orderDataByDate = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.params;

    const convertedDate = await validateDate(date);

    const orderDataByDate = await AdminService.orderDataByDate(convertedDate);

    return res.status(200).json({
      message: 'Successful data request',
      data: orderDataByDate,
      status: 200,
    });
  });

  public static dataByDate = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.params;

    const convertedDate = await validateDate(date);

    const dataByDate = await AdminService.dataByDate(convertedDate);

    return res.status(200).json({
      message: 'Successful data request',
      data: dataByDate,
      status: 200,
    });
  });

  public static newOrder = asyncHandler(async (req: Request, res: Response) => {
    const { body } = req;

    const validatedData = await validateOrderInput(body);

    const newOrder = await AdminService.newOrder(validatedData);

    return res.status(201).json({
      message: 'Order created',
      data: newOrder,
      status: 201,
    });
  });

  public static orderToRemove = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const objectIdValidation = validateObjectId(id);

    if (objectIdValidation === false) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    const deletionStatus = await AdminService.orderToRemove(id);

    return res.status(201).json({
      message: 'Order request processed',
      data: deletionStatus,
      status: 201,
    });
  });

  public static workerStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const objectIdValidation = validateObjectId(id);

    if (objectIdValidation === false) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    const updateResult = await AdminService.workerStatus(id);
    return res.status(201).json({
      message: 'Worker status updated',
      data: updateResult,
      status: 201,
    });
  });
}

export { AdminController };
