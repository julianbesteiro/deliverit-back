describe('/api/admin/date', () => {
  it('should have the expected response structure', async () => {
    const response = {
      availableWorkers: 4,
      activeWorkers: 2,
      availableOrders: 6,
      deliveredOrders: 5,
    };

    expect(response).toEqual({
      availableWorkers: expect.any(Number),
      activeWorkers: expect.any(Number),
      availableOrders: expect.any(Number),
      deliveredOrders: expect.any(Number),
    });

    expect(response.activeWorkers).toBeLessThanOrEqual(response.availableWorkers);

    expect(response.deliveredOrders).toBeLessThanOrEqual(response.availableOrders);

    expect(Object.keys(response).length).toEqual(4);

    expect(typeof response).toEqual('object');
  });
});

describe('/api/admin/date/workers', () => {
  it('should have the expected response structure', async () => {
    const responseWorkers = [
      { workerId: 12312, status: 'active', percentage: 100 },
      { workerId: 12313, status: 'active', percentage: 91 },
      { workerId: 12314, status: 'inactive', percentage: 0 },
    ];

    expect(Array.isArray(responseWorkers)).toEqual(true);

    if (responseWorkers.length > 0) {
      responseWorkers.forEach((worker) => {
        expect(Object.keys(worker).length).toEqual(3);
        expect(worker).toEqual({
          workerId: expect.any(Number),
          status: expect.any(String),
          percentage: expect.any(Number),
        });
        expect(worker.status).toMatch(/^(active|inactive)$/);
        expect(worker.percentage).toBeLessThanOrEqual(100);

        if (worker.status === 'inactive') {
          expect(worker.percentage).toEqual(0);
        }
      });
    }

    const workerIdsArray = Object.values(responseWorkers.map((worker) => worker.workerId));
    const uniqueWorkerIdsArray = [...new Set(workerIdsArray)];

    expect(workerIdsArray).toEqual(uniqueWorkerIdsArray);
  });
});

//utils

interface IDelivery {
  orderId: number;
  address: string;
}

const ordersCheck = (orders: Array<IDelivery>) => {
  expect(Array.isArray(orders)).toEqual(true);

  if (orders.length > 0) {
    orders.forEach((order) => {
      expect(Object.keys(order).length).toEqual(2);
      expect(order).toEqual({
        orderId: expect.any(Number),
        address: expect.any(String),
      });
    });
  }

  const orderIdsArray = Object.values(orders.map((order) => order.orderId));
  const uniqueOrderIdsArray = [...new Set(orderIdsArray)];

  expect(orderIdsArray).toEqual(uniqueOrderIdsArray);
};

describe('/api/admin/date/orders', () => {
  it('should have the expected response structure', async () => {
    const responseOrders = [
      { orderId: 2112, address: 'casa 1312, CABA' },
      { orderId: 2113, address: 'casa 1313, CABA' },
      { orderId: 2114, address: 'casa 1314, CABA' },
    ];

    ordersCheck(responseOrders);
  });
});

describe('/api/admin/workers/id', () => {
  it('should have the expected response structure', async () => {
    const responseIndividualWorker = {
      workerId: 21312,
      status: 'active',
      pendingOrders: [
        { orderId: 2112, address: 'casa 1312, CABA' },
        { orderId: 2113, address: 'casa 1313, CABA' },
        { orderId: 2114, address: 'casa 1314, CABA' },
      ],
      deliveredOrders: [
        { orderId: 2115, address: 'casa 1315, CABA' },
        { orderId: 2116, address: 'casa 1316, CABA' },
      ],
    };

    expect(typeof responseIndividualWorker).toEqual('object');

    expect(Object.keys(responseIndividualWorker).length).toEqual(4);

    expect(responseIndividualWorker).toEqual({
      workerId: expect.any(Number),
      status: expect.any(String),
      pendingOrders: expect.any(Array),
      deliveredOrders: expect.any(Array),
    });

    expect(responseIndividualWorker.status).toMatch(/^(active|inactive)$/);

    ordersCheck(responseIndividualWorker.pendingOrders);

    ordersCheck(responseIndividualWorker.deliveredOrders);
  });
});
