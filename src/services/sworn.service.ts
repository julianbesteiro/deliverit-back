import { IRepository, ISworn, SwornServiceResponse } from '../interfaces';
import { ISwornService } from '../interfaces/services/ISwornService';
import { UserRepository } from '../repository';

class SwornService implements ISwornService {
  constructor(private readonly signSwornRepository: IRepository<ISworn>) {}

  async createSworn(sworn: ISworn): Promise<SwornServiceResponse> {
    //Check if any of the conditions is true
    const hasIssue =
      sworn.alcoholicBeverages || sworn.psychoactiveMedication || sworn.familyProblem;

    //Determine the sworn statement status and user's enabled status based on the conditions
    const swornStatementStatus = hasIssue ? 'rejected' : 'approved';
    const enabled = !hasIssue;

    //Update the Sworn model with the swornStatementStatus
    sworn.swornStatementStatus = swornStatementStatus;
    const newSworn = await this.signSwornRepository.create(sworn);
    //Update the User model with the enabled status and set blockUntil
    const blockUntil = hasIssue ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    const updatedUser = await UserRepository.updateUserById(sworn.userId, { enabled, blockUntil });

    //Implement logic to update the deliveries and orders status if the sworn statement is rejected

    return { sworn: newSworn, updatedUser };
  }
  async deleteSworn(swornId: string): Promise<void> {
    const deletedSworn = await this.signSwornRepository.delete(swornId);
    return deletedSworn;
  }
}

export default SwornService;
