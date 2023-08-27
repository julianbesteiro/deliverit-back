import DeliveryService from '@/services/delivery.service';
import DeliveryRepository from '@/repository/delivery.repository';
import { IDelivery, IDeliveryModel } from '@/interfaces';
import { ObjectId } from 'mongodb';

jest.mock('@/repository/delivery.repository');

describe('DeliveryService', () => {
  let mockRepository: jest.Mocked<DeliveryRepository>;
  let deliveryService: DeliveryService;

  beforeEach(() => {
    mockRepository = new DeliveryRepository(
      {} as IDeliveryModel,
    ) as jest.Mocked<DeliveryRepository>;
    deliveryService = new DeliveryService(mockRepository);
  });

  it('createDelivery ====>', async () => {
    const mockDelivery: IDelivery = {
      status: 'pending',
      orderId: new ObjectId(),
      userId: new ObjectId(),
    };

    mockRepository.create.mockResolvedValue(mockDelivery);

    const result = await deliveryService.createDelivery(mockDelivery);

    expect(result).toMatchObject(mockDelivery);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(mockDelivery);
  });

  it('getDeliveries ====>', async () => {
    const mockDelivery: IDelivery = {
      orderId: new ObjectId(),
      userId: new ObjectId(),
    };

    mockRepository.findAll.mockResolvedValue([mockDelivery]);

    const result = await deliveryService.getDeliveries();

    expect(result).toMatchObject([mockDelivery]);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('getDeliveryById ====>', async () => {
    const mockId = new ObjectId();

    const mockDelivery: IDelivery = {
      orderId: new ObjectId(),
      userId: new ObjectId(),
    };

    mockRepository.findById.mockResolvedValue(mockDelivery);

    const result = await deliveryService.getDelivery(mockId.toHexString());

    expect(result).toMatchObject(mockDelivery);
    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(mockId.toHexString());
  });

  it('updateDelivery ====>', async () => {
    const mockId = new ObjectId();

    const mockDelivery: IDelivery = {
      orderId: new ObjectId(),
      userId: new ObjectId(),
    };

    mockRepository.update.mockResolvedValue(mockDelivery);

    const result = await deliveryService.updateDelivery(mockId.toHexString(), mockDelivery);

    expect(result).toMatchObject(mockDelivery);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(mockId.toHexString(), mockDelivery);
  });

  it('deleteDelivery ====>', async () => {
    const mockId = new ObjectId();

    mockRepository.delete.mockResolvedValue();

    await deliveryService.deleteDelivery(mockId.toHexString());

    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(mockId.toHexString());
  });

  it('getDeliveriesByUser ====>', async () => {
    const mockDelivery: IDelivery = {
      orderId: new ObjectId(),
      userId: new ObjectId(),
    };

    const mockFilters = { userId: mockDelivery.userId.toHexString() };

    mockRepository.findAll.mockResolvedValue([mockDelivery]);

    const result = await deliveryService.getDeliveriesByUser(mockFilters);

    expect(result).toMatchObject([mockDelivery]);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockRepository.findAll).toHaveBeenCalledWith(mockFilters);
  });

  it('patchDelivery ====>', async () => {
    const mockDelivery: IDelivery = {
      orderId: new ObjectId(),
      userId: new ObjectId(),
    };

    const mockFilters = { userId: mockDelivery.userId.toHexString() };

    mockRepository.update.mockResolvedValue(mockDelivery);

    const result = await deliveryService.patchDelivery(mockFilters);

    expect(result).toMatchObject(mockDelivery);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(mockFilters, mockDelivery);
  });
});
