import UserModel from '../models/User';
import { UnauthorizedError, ValidationError } from '../errors/customErrors';

export const isBlockedByAdmin = async (id: string) => {
  const workerData = await UserModel.findOne({ _id: id });

  if (!workerData) {
    throw new ValidationError('Invalid id');
  }

  const blockUntil = workerData.blockUntil
    ? Number(new Date(workerData.blockUntil))
    : Number(new Date());

  const differenceBetweenBlockUntilAndCurrentDate = blockUntil - Number(new Date());

  if (differenceBetweenBlockUntilAndCurrentDate > 86400000) {
    throw new UnauthorizedError(
      "You don't have permission to create deliveries due to an admin block",
    );
  }

  return workerData;
};
