import { IRepository, ISworn } from '../interfaces';
import { ISwornService } from '../interfaces/services/ISwornService';

class SwornService implements ISwornService {
  constructor(private readonly signwornRepository: IRepository<ISworn>) {}

  async createSworn(sworn: ISworn): Promise<ISworn> {
    const newSworn = await this.signwornRepository.create(sworn);
    return newSworn;
  }
  async deleteSworn(swornId: string): Promise<void> {
    const deletedSworn = await this.signwornRepository.delete(swornId);
    return deletedSworn;
  }
}

export default SwornService;
