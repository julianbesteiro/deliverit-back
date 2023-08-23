describe('DeliveryService', () => {
  beforeAll(async () => {
    jest.mock('@/repositories/delivery.repository');
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('createDeliveries', () => {});
});
