import { RequestExpress } from '../interfaces/IRequestExpress';
import { ISwornService } from '../interfaces/services/ISwornService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateSwornInput } from '../utils/validateSworn';
import { Request, Response } from 'express';
import { canSubmitSworn } from '../utils/canSubmitSworn';
import { UserService } from '../services';

class SwornController {
  constructor(private readonly swornService: ISwornService) {}

  createSworn = asyncHandler(async (req: RequestExpress | Request, res: Response) => {
    const { body } = req;
    const { user } = req as RequestExpress;

    const canSubmit = await canSubmitSworn(user.id);
    if (!canSubmit) {
      return res.status(403).json({
        success: false,
        message: 'You already submit a sworn statement today',
      });
    }

    const swornValidate = validateSwornInput(body);

    const { sworn: newSworn, updatedUser } = await this.swornService.createSworn({
      ...swornValidate,
      userId: user.id,
    });

    const isAvailable = !(
      newSworn.alcoholicBeverages ||
      newSworn.psychoactiveMedication ||
      newSworn.familyProblem
    );

    const userPublicData = {
      id: updatedUser.id,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      enabled: updatedUser.enabled,
      blockUntil: updatedUser.blockUntil,
      lastSeenAt: updatedUser.lastSeenAt,
      urlImage: updatedUser.urlImage,
      role: updatedUser.role,
    };

    const { token } = await UserService.generateUserToken(updatedUser);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(201).json({
      success: isAvailable,
      data: newSworn,
      user: userPublicData,
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
