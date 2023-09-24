import { NextFunction, Response } from 'express';
import { RequestExpress } from '../interfaces/IRequestExpress';
import httpStatus from 'http-status';

const canStartDelivery = async (req: RequestExpress, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.blockUntil && new Date() < user.blockUntil) {
    return res.status(httpStatus.FORBIDDEN).json({
      message: `You are not allowed to start a delivery due to your last sworn statement until ${user.blockUntil}`,
    });
  }

  if (!user.enabled) {
    return res.status(httpStatus.FORBIDDEN).json({
      message: 'You must complete the sworn statement before starting a delivery',
    });
  }

  next();
};

export default canStartDelivery;
