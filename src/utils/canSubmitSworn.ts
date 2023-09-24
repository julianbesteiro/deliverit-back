import SwornModel from '../models/Sworn';
import SwornRepository from '../repository/sworn.repository';

export const canSubmitSworn = async (userId: string): Promise<boolean> => {
  const swornRepo = new SwornRepository(SwornModel);

  const lastSwornStatement = await swornRepo.getLastSwornStatement(userId);

  if (!lastSwornStatement) {
    return true;
  }

  const currentDate = new Date();
  const lastSubmissionDate = new Date(lastSwornStatement.createdAt);

  //Check if the last submission was made on the same day
  if (currentDate.toDateString() === lastSubmissionDate.toDateString()) {
    return false;
  }

  return true;
};
