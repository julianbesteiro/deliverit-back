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

  async getLastSwornStatement(userId: string): Promise<ISworn | null> {
    try {
      //Find the last sworn statement
      const lastSwornStatement = await this.swornModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(1);
      return lastSwornStatement[0];
    } catch (error) {
      throw new BadUserInputError({ message: 'Sworn not found' });
    }
  }

  //eslint-disable-next-line
  async findById(id: string, filters?: BaseFilters | undefined): Promise<ISworn> {
    return {
      alcoholicBeverages: false,
      psychoactiveMedication: false,
      familyProblem: false,
      userId: '',
      swornStatementStatus: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  //eslint-disable-next-line
  async update(id: string, item: ISworn): Promise<ISworn> {
    return {
      alcoholicBeverages: false,
      psychoactiveMedication: false,
      familyProblem: false,
      userId: '',
      swornStatementStatus: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  //eslint-disable-next-line
  async delete(id: string, userId: string): Promise<void> {}
}

export default SwornRepository;
