describe('/api/admin/date', () => {
  it('should have the expected response structure for a specific date', async () => {
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

    expect(Object.keys(response)[0]).not.toBeNaN();
  });
});
