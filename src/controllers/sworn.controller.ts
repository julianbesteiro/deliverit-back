import { RequestExpress } from '@/interfaces/IRequestExpress';
import { ISwornService } from '@/interfaces/ISwornService';
import { asyncHandler } from '@/utils/asyncHandler';
import { Request, Response } from 'express';

class SwornController {
  constructor(private readonly swornService: ISwornService) {}

  createSworn = asyncHandler(async (req: RequestExpress | Request, res: Response) => {
    const { body } = req;
    const { user } = req as RequestExpress;

    const newSworn = await this.swornService.createSworn({
      ...body,
      user: user.id,
    });

    res.status(201).json({
      success: true,
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
