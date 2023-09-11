import { IDelivery, IRepository, PaginationData } from '@/interfaces';
import DeliveryService from '@/services/delivery.service';
import { ObjectId } from 'mongodb';

class MockRepository implements IRepository<IDelivery> {
  create(item: IDelivery): Promise<IDelivery> {
    const delivery: Promise<IDelivery> = new Promise((resolve) => {
      resolve({
        _id: new ObjectId('64f792433c82f3350d9e164d').toHexString(),
        orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
        userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
        status: 'pending',
      });
    });

    return delivery;
  }
  update(id: string, item: IDelivery): Promise<IDelivery> {
    const delivery: Promise<IDelivery> = new Promise((resolve) => {
      resolve({
        _id: new ObjectId('64f792433c82f3350d9e164d').toHexString(),
        orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
        userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
        status: 'delivered',
      });
    });

    return delivery;
  }
  delete(id: string): Promise<void> {
    const delivery: Promise<void> = new Promise((resolve) => {
      resolve(undefined);
    });

    return delivery;
  }
  findAll(): Promise<PaginationData<IDelivery>> {
    const deliveries: Promise<PaginationData<IDelivery>> = new Promise((resolve) => {
      resolve({
        data: [
          {
            _id: new ObjectId('64f792433c82f3350d9e164d').toHexString(),
            orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
            userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
            status: 'pending',
          },
        ],
        page: 1,
        totalPages: 1,
        totalItems: 1,
      });
    });
    return deliveries;
  }
  findById(id: string): Promise<IDelivery> {
    const delivery: Promise<IDelivery> = new Promise((resolve) => {
      resolve({
        _id: new ObjectId('64f792433c82f3350d9e164d').toHexString(),
        orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
        userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
        status: 'pending',
      });
    });
    return delivery;
  }
}

describe('DeliveryService', () => {
  let deliveryService: DeliveryService;
  let mockRepository: MockRepository;

  beforeEach(() => {
    mockRepository = new MockRepository();
    deliveryService = new DeliveryService(mockRepository);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('getDeliveries', () => {
    it('should return an array of deliveries', async () => {
      const filters = {
        page: 2,
        status: 'pending',
        userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
      };

      const repositoryMock = jest.spyOn(mockRepository, 'findAll');

      const deliveries = await deliveryService.getDeliveries(filters);

      expect(repositoryMock).toHaveBeenCalledTimes(1);
      expect(repositoryMock).toHaveBeenCalledWith(filters);
      expect(deliveries).toEqual({
        data: [
          {
            _id: new ObjectId('64f792433c82f3350d9e164d').toHexString(),
            orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
            userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
            status: 'pending',
          },
        ],
        page: 1,
        totalPages: 1,
        totalItems: 1,
      });
    });

    it('should return an array of deliveries without filters', async () => {
      const repositoryMock = jest.spyOn(mockRepository, 'findAll');

      const deliveries = await deliveryService.getDeliveries();

      expect(repositoryMock).toHaveBeenCalledTimes(1);
      expect(deliveries).toEqual({
        data: [
          {
            _id: new ObjectId('64f792433c82f3350d9e164d').toHexString(),
            orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
            userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
            status: 'pending',
          },
        ],
        page: 1,
        totalPages: 1,
        totalItems: 1,
      });
    });
  });

  describe('createDelivery', () => {
    it('should create a delivery', async () => {
      const deliveryDTO = {
        userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
        orders: [
          {
            orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
          },
          {
            orderId: new ObjectId('64f8d822832a4a979369bf66').toHexString(),
          },
        ],
      };

      const repositoryMock = jest.spyOn(mockRepository, 'create');

      const delivery = await deliveryService.createDelivery(deliveryDTO);

      expect(repositoryMock).toHaveBeenCalledTimes(2);
      expect(repositoryMock).toHaveBeenCalledWith({
        orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
        userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
      });
    });
  });

  describe('getDelivery', () => {
    it('should return a delivery', async () => {
      const repositoryMock = jest.spyOn(mockRepository, 'findById');

      const delivery = await deliveryService.getDelivery(
        new ObjectId('64f792433c82f3350d9e164d').toHexString(),
      );

      expect(repositoryMock).toHaveBeenCalledTimes(1);
      expect(repositoryMock).toHaveBeenCalledWith(
        new ObjectId('64f792433c82f3350d9e164d').toHexString(),
      );
      expect(delivery).toEqual({
        _id: new ObjectId('64f792433c82f3350d9e164d').toHexString(),
        orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
        userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
        status: 'pending',
      });
    });
  });

  describe('updateDelivery', () => {
    it('should update a delivery', async () => {
      const repositoryMock = jest.spyOn(mockRepository, 'update');

      const delivery = await deliveryService.updateDelivery(
        new ObjectId('64f792433c82f3350d9e164d').toHexString(),
        {
          status: 'delivered',
        },
      );

      expect(repositoryMock).toHaveBeenCalledTimes(1);
      expect(repositoryMock).toHaveBeenCalledWith(
        new ObjectId('64f792433c82f3350d9e164d').toHexString(),
        {
          status: 'delivered',
        },
      );
      expect(delivery).toEqual({
        _id: new ObjectId('64f792433c82f3350d9e164d').toHexString(),
        orderId: new ObjectId('64f8d822832a4a979369bf65').toHexString(),
        userId: new ObjectId('64f65996eca69a74e40cc077').toHexString(),
        status: 'delivered',
      });
    });
  });

  describe('deleteDelivery', () => {
    it('should delete a delivery', async () => {
      const repositoryMock = jest.spyOn(mockRepository, 'delete');

      const delivery = await deliveryService.deleteDelivery(
        new ObjectId('64f792433c82f3350d9e164d').toHexString(),
      );

      expect(repositoryMock).toHaveBeenCalledTimes(1);
      expect(repositoryMock).toHaveBeenCalledWith(
        new ObjectId('64f792433c82f3350d9e164d').toHexString(),
      );
      expect(delivery).toBeUndefined();
    });
  });
});
