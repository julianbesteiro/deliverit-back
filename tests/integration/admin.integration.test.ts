import request from 'supertest';
import express from 'express';
import { AdminController, UserController } from '@/controllers';
import AdminService from '@/services/admin.service';
import { errorHandler } from '@/middlewares';
import { connect, disconnect } from '../../config/db/db';
import UserModel from '@/models/User';
import OrderModel from '@/models/Order';
import DeliveryModel from '@/models/Delivery';
import { OrderService } from '@/services';
import { IWorker } from '@/interfaces';
import { ordersCheck } from '../utils/ordersCheck';

const app = express();

app.use(express.json());
app.post('/orders/create', AdminController.newOrder);
app.get('/workers/:id', AdminController.workerDataById);
app.get('/:date/orders', AdminController.orderDataByDate);
app.get('/:date', AdminController.dataByDate);
app.delete('/orders/delete/:id', AdminController.orderToRemove);
app.put('/edit-status/:id', AdminController.workerStatus);
app.get('/:date/workers', AdminController.workerDataByDate);

app.use(errorHandler);

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await OrderModel.deleteMany({});
  await UserModel.deleteMany({});
  await DeliveryModel.deleteMany({});
});

afterAll(async () => {
  await disconnect();
}, 10000);

describe('Admin Integration Tests:', () => {
  describe('Admin Order creation:', () => {
    it('should create a new order', async () => {
      const newOrder = {
        address: 'casa 13, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        status: 'unassigned',
        deliveryDate: '2023-09-01T00:00:00.000Z',
      };

      const response = await request(app)
        .post('/orders/create')
        .send({
          address: 'casa 13, CABA',
          coords: {
            lat: -34.603722,
            lng: -58.381592,
          },
          packagesQuantity: 3,
          weight: 2,
          recipient: 'Juan Perez',
          deliveryDate: '2023-09-01',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Order created');
      expect(response.body.data).toEqual({
        address: newOrder.address,
        coords: newOrder.coords,
        packagesQuantity: newOrder.packagesQuantity,
        weight: newOrder.weight,
        recipient: newOrder.recipient,
        status: newOrder.status,
        deliveryDate: newOrder.deliveryDate,
      });
      expect(response.body.data).toEqual({
        address: expect.any(String),
        packagesQuantity: expect.any(Number),
        coords: expect.any(Object),
        weight: expect.any(Number),
        recipient: expect.any(String),
        status: expect.any(String),
        deliveryDate: expect.any(String),
      });

      expect(response.body.data.coords).toEqual(
        expect.objectContaining({ lat: expect.any(Number), lng: expect.any(Number) }),
      );

      expect(Object.keys(response.body.data).length).toEqual(7);

      expect(typeof response.body.data).toEqual('object');

      const createdDocument = await OrderModel.findOne({});

      expect(createdDocument).toBeTruthy();
      expect(createdDocument?.address).toBe('casa 13, CABA');
    });

    const testCases = [
      {
        description: 'should throw an error if the request body is empty',
        requestBody: {},
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the request body is null',
        requestBody: null,
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the request body is undefined',
        requestBody: undefined,
        expectedStatus: 400,
      },
    ];

    testCases.forEach(({ description, requestBody, expectedStatus }) => {
      it(description, async () => {
        const response = await request(app).post('/orders/create').send({ requestBody });

        expect(response.status).toBe(expectedStatus);
      });
    });
  });

  describe('Admin Order deletion:', () => {
    it('should delete an order', async () => {
      const dateString = new Date().toISOString().toString().slice(0, 10);

      const orderCreated = await OrderModel.create({
        address: 'casa 13, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        deliveryDate: dateString,
      });

      const createdDocument = await OrderModel.findOne({});
      expect(createdDocument).toBeTruthy();
      expect(createdDocument?.address).toBe('casa 13, CABA');

      const response = await request(app).delete(`/orders/delete/${orderCreated._id.toString()}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Order request processed');
      expect(response.body.data).toEqual('Order deleted');

      const createdDocument2 = await OrderModel.findOne({});
      expect(createdDocument2).toBeFalsy();
    });

    const testCases = [
      {
        description: 'should throw an error if the id is invalid',
        id: 'sdfsd',
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the id is null',
        id: null,
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the id is undefined',
        id: undefined,
        expectedStatus: 400,
      },
    ];

    testCases.forEach(({ description, id, expectedStatus }) => {
      it(description, async () => {
        const response = await request(app).get(`/workers/${id}`);

        expect(response.status).toBe(expectedStatus);
      });
    });
  });

  describe('Admin Worker status edit:', () => {
    it('should edit the worker status', async () => {
      const userCreated = await UserModel.create({
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaellaaaaa@aaaaexample.com',
        password: '0303456lalala',
      });

      const userCreated2 = await UserModel.create({
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaellaaaaaa@aaaaexample.com',
        password: '0303456lalala',
        enabled: false,
      });

      const response = await request(app).put(`/edit-status/${userCreated._id.toString()}`);
      const response2 = await request(app).put(`/edit-status/${userCreated2._id.toString()}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Worker status updated');
      expect(response.body.data).toEqual('Worker status updated to inactive');

      expect(response2.status).toBe(201);
      expect(response2.body.message).toBe('Worker status updated');
      expect(response2.body.data).toEqual('Worker status updated to active');

      const userSearch = await UserModel.findOne({ _id: userCreated._id });
      expect(userSearch?.enabled).toBe(false);

      const userSearch2 = await UserModel.findOne({ _id: userCreated2._id });
      expect(userSearch2?.enabled).toBe(true);
    });

    const testCases = [
      {
        description: 'should throw an error if the id is invalid',
        id: 'asdas',
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the id is null',
        id: null,
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the id is undefined',
        id: undefined,
        expectedStatus: 400,
      },
    ];

    testCases.forEach(({ description, id, expectedStatus }) => {
      it(description, async () => {
        const response = await request(app).put(`/edit-status/${id}`);

        expect(response.status).toBe(expectedStatus);
      });
    });
  });

  describe('Admin Get Data by Date', () => {
    it('should retrieve data by date', async () => {
      const dateString = new Date().toISOString().toString().slice(0, 10);

      const orderCreated = await OrderModel.create({
        address: 'casa 13, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        deliveryDate: dateString,
      });
      const orderCreated2 = await OrderModel.create({
        address: 'casa 14, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        deliveryDate: dateString,
      });

      const userCreated = await UserModel.create({
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaella@example.com',
        password: '0303456lalala',
      });

      const userCreated2 = await UserModel.create({
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaellaa@aexample.com',
        password: '0303456lalala',
      });

      await DeliveryModel.create({
        destinationLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        startingLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        orderId: orderCreated._id,
        userId: userCreated._id,
        status: 'pending',
        startingDeliveryDate: dateString,
        resolutionDeliveryDate: dateString,
      });

      await DeliveryModel.create({
        destinationLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        startingLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        orderId: orderCreated2._id,
        userId: userCreated2._id,
        status: 'delivered',
        startingDeliveryDate: dateString,
        resolutionDeliveryDate: dateString,
      });

      const response = await request(app).get(`/${dateString}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successful data request');
      expect(response.body.data).toEqual({
        deliveredOrders: 1,
        availableOrders: 2,
        availableWorkers: 2,
        activeWorkers: 1,
      });

      expect(response.body.data).toEqual({
        availableWorkers: expect.any(Number),
        activeWorkers: expect.any(Number),
        availableOrders: expect.any(Number),
        deliveredOrders: expect.any(Number),
      });

      expect(response.body.data.activeWorkers).toBeLessThanOrEqual(
        response.body.data.availableWorkers,
      );

      expect(response.body.data.deliveredOrders).toBeLessThanOrEqual(
        response.body.data.availableOrders,
      );

      expect(Object.keys(response.body.data).length).toEqual(4);

      expect(typeof response.body.data).toEqual('object');
    });

    const testCases = [
      {
        description: 'should throw an error if the date is invalid',
        date: 'kjhjkh',
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the date is null',
        date: null,
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the date is undefined',
        date: undefined,
        expectedStatus: 400,
      },
    ];

    testCases.forEach(({ description, date, expectedStatus }) => {
      it(description, async () => {
        const response = await request(app).get(`/${date}`);

        expect(response.status).toBe(expectedStatus);
      });
    });
  });

  describe('Admin Get Worker Data by Date', () => {
    it('should retrieve worker data by date', async () => {
      const dateString = new Date().toISOString().toString().slice(0, 10);

      const userCreated = await UserModel.create({
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaellaaa@aaexample.com',
        password: '0303456lalala',
      });

      const orderCreated = await OrderModel.create({
        address: 'casa 15, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        deliveryDate: dateString,
      });

      await DeliveryModel.create({
        destinationLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        startingLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        orderId: orderCreated._id,
        userId: userCreated._id,
        status: 'delivered',
        startingDeliveryDate: dateString,
        resolutionDeliveryDate: dateString,
      });
      const response = await request(app).get(`/${dateString}/workers`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successful data request');
      expect(response.body.data).toEqual([
        {
          workerId: userCreated._id.toString(),
          status: 'active',
          percentage: 100,
        },
      ]);
      expect(Array.isArray(response.body.data)).toEqual(true);
      if (response.body.data.length > 0) {
        response.body.data.forEach((worker: IWorker) => {
          expect(Object.keys(worker).length).toEqual(3);
          expect(worker).toEqual({
            workerId: expect.any(String),
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

      const workerIdsArray = Object.values(
        response.body.data.map((worker: IWorker) => worker.workerId),
      );
      const uniqueWorkerIdsArray = [...new Set(workerIdsArray)];

      expect(workerIdsArray).toEqual(uniqueWorkerIdsArray);
    });

    const testCases = [
      {
        description: 'should throw an error if the params are invalid',
        date: 'dasdas',
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the params are null',
        date: null,
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the params are undefined',
        date: undefined,
        expectedStatus: 400,
      },
    ];

    testCases.forEach(({ description, date, expectedStatus }) => {
      it(description, async () => {
        const response = await request(app).get(`/${date}/workers`);

        expect(response.status).toBe(expectedStatus);
      });
    });
  });

  describe('Admin Get Worker Data by Id', () => {
    it('should retrieve worker data by id', async () => {
      const dateString = new Date().toISOString().toString().slice(0, 10);

      const userCreatedGetWorkerDataById = await UserModel.create({
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaellaaaa@aaaexample.com',
        password: '0303456lalala',
      });

      const orderCreatedGetWorkerDataById = await OrderModel.create({
        address: 'casa 16, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Rafaella Carra',
        deliveryDate: dateString,
      });

      const orderCreated2GetWorkerDataById = await OrderModel.create({
        address: 'casa 17, CABA',
        coords: {
          lat: -44.603722,
          lng: -68.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Rafaella Carra',
        deliveryDate: dateString,
      });

      const deliveryCreatedGetWorkerDataById = await DeliveryModel.create({
        destinationLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        startingLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        orderId: orderCreatedGetWorkerDataById._id,
        userId: userCreatedGetWorkerDataById._id,
        status: 'delivered',
        startingDeliveryDate: dateString,
        resolutionDeliveryDate: dateString,
      });

      const deliveryCreated2GetWorkerDataById = await DeliveryModel.create({
        destinationLocation: {
          lat: -44.603722,
          lng: -68.381592,
        },
        startingLocation: {
          lat: -34.603722,
          lng: -58.381592,
        },
        orderId: orderCreated2GetWorkerDataById._id,
        userId: userCreatedGetWorkerDataById._id,
        status: 'pending',
        startingDeliveryDate: dateString,
        resolutionDeliveryDate: dateString,
      });

      const response = await request(app).get(`/workers/${userCreatedGetWorkerDataById._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successful data request');
      expect(response.body.data).toEqual({
        workerId: userCreatedGetWorkerDataById._id.toString(),
        status: 'active',
        deliveredOrders: [
          {
            orderId: deliveryCreatedGetWorkerDataById.orderId.toString(),
            address: deliveryCreatedGetWorkerDataById.destinationLocation,
          },
        ],
        pendingOrders: [
          {
            orderId: deliveryCreated2GetWorkerDataById.orderId.toString(),
            address: deliveryCreated2GetWorkerDataById.destinationLocation,
          },
        ],
      });

      expect(typeof response.body.data).toEqual('object');

      expect(Object.keys(response.body.data).length).toEqual(4);

      expect(response.body.data).toEqual({
        workerId: expect.any(String),
        status: expect.any(String),
        pendingOrders: expect.any(Array),
        deliveredOrders: expect.any(Array),
      });

      expect(response.body.data.status).toMatch(/^(active|inactive)$/);

      //ordersCheck(response.body.data.pendingOrders);
    });
  });

  const testCases = [
    {
      description: 'should throw an error if the id is invalid',
      id: 'sdfsdf',
      expectedStatus: 400,
    },
    {
      description: 'should throw an error if the id is null',
      id: null,
      expectedStatus: 400,
    },
    {
      description: 'should throw an error if the id is undefined',
      id: undefined,
      expectedStatus: 400,
    },
  ];

  testCases.forEach(({ description, id, expectedStatus }) => {
    it(description, async () => {
      const response = await request(app).get(`/workers/${id}`);

      expect(response.status).toBe(expectedStatus);
    });
  });

  describe('Admin Get Order Data by Date', () => {
    it('should retrieve worker data by date', async () => {
      const dateString = new Date().toISOString().toString().slice(0, 10);

      const orderCreated = await OrderModel.create({
        address: 'casa 15, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        deliveryDate: dateString,
      });

      const orderCreated2 = await OrderModel.create({
        address: 'casa 16, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        deliveryDate: dateString,
      });

      const response = await request(app).get(`/${dateString}/orders`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successful data request');
      expect(response.body.data).toEqual([
        {
          orderId: orderCreated._id.toString(),
          address: orderCreated.address,
        },
        {
          orderId: orderCreated2._id.toString(),
          address: orderCreated2.address,
        },
      ]);
      ordersCheck(response.body.data);
    });
    const testCases = [
      {
        description: 'should throw an error if the params are invalid',
        date: 'dasdas',
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the params are null',
        date: null,
        expectedStatus: 400,
      },
      {
        description: 'should throw an error if the params are undefined',
        date: undefined,
        expectedStatus: 400,
      },
    ];

    testCases.forEach(({ description, date, expectedStatus }) => {
      it(description, async () => {
        const response = await request(app).get(`/${date}/orders`);

        expect(response.status).toBe(expectedStatus);
      });
    });
  });
});
