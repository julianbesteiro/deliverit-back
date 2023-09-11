import { BaseFilters, ISworn, ISwornModel } from '../interfaces';
import { IRepository, PaginationData } from '../interfaces/IRepository';
import { BadUserInputError } from '../errors/customErrors';

class SwornRepository implements IRepository<ISworn> {
  constructor(private readonly swornModel: ISwornModel) {}
  async create(item: ISworn): Promise<ISworn> {
    const swornCreated = await this.swornModel.create(item);

    if (!swornCreated) {
      throw new BadUserInputError({ message: 'Sworn not created' });
    }

    return swornCreated;
  }
  //eslint-disable-next-line
  async findAll(filters?: BaseFilters | undefined): Promise<PaginationData<ISworn>> {
    return {
      data: [],
      page: 1,
      totalPages: 1,
      totalItems: 1,
    };
  }
  //eslint-disable-next-line
  async findById(id: string, filters?: BaseFilters | undefined): Promise<ISworn> {
    return {
      alcoholicBeverages: false,
      psychoactiveMedication: false,
      familyProblem: false,
      userId: '',
    };
  }
  //eslint-disable-next-line
  async update(id: string, item: ISworn): Promise<ISworn> {
    return {
      alcoholicBeverages: false,
      psychoactiveMedication: false,
      familyProblem: false,
      userId: '',
    };
  }
  async delete(id: string): Promise<void> {
    const swornDeleted = this.swornModel.findByIdAndDelete(id);

    if (!swornDeleted) {
      throw new BadUserInputError({ message: 'Sworn not deleted' });
    }
    return;
  }
}

export default SwornRepository;
