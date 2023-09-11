import { RequestExpress } from '../interfaces/IRequestExpress';
import { ISwornService } from '../interfaces/services/ISwornService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateSwornInput } from '../utils/validateSworn';
import { Request, Response } from 'express';

class SwornController {
  constructor(private readonly swornService: ISwornService) {}

  createSworn = asyncHandler(async (req: RequestExpress | Request, res: Response) => {
    const { body } = req;
    const { user } = req as RequestExpress;

    const swornValidate = validateSwornInput(body);

    const newSworn = await this.swornService.createSworn({
      ...swornValidate,
      userId: user.id,
    });

    const isAvailable =
      newSworn.alcoholicBeverages && newSworn.psychoactiveMedication && newSworn.familyProblem;

    res.status(201).json({
      success: isAvailable,
      data: newSworn,
    });
  });

  deleteSworn = asyncHandler(async (req: RequestExpress | Request, res: Response) => {
    const { id } = req.params;

    await this.swornService.deleteSworn(id);

    res.status(200).json({
      success: true,
      data: {},
    });
  });
}

export { SwornController };
