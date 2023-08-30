import request from 'supertest';
import express from 'express';
import { UserController } from '../../src/controllers';
import { connect, disconnect } from '../../config/db/db';
import User from '../../src/models/User';
import errorHandler from '../../src/middlewares/errorHandler';

const app = express();
app.use(express.json());
app.post('/user/signup', UserController.createUser);
app.use(errorHandler);

beforeEach(async () => {
  await connect();
});

afterAll(async () => {
  await connect();
  await User.deleteOne({ email: 'rafaella@example.com' });
  await disconnect();
}, 10000);

describe('POST /user/signup', () => {
  const userData = {
    name: 'Rafaella',
    lastName: 'Carra',
    email: 'rafaella@example.com',
    password: '0303456lalala',
  };

  it('should create a user', async () => {
    const response = await request(app).post('/user/signup').send(userData);

    expect(response.status).toBe(201);
    expect(response.text).toBe('Created Successfully');
  });

  it("shouldn't create a user with an existing email", async () => {
    const response = await request(app).post('/user/signup').send(userData);

    expect(response.status).toBe(409);
    expect(response.text).toMatch('E11000 duplicate key error');
  });

  it("shouldn't create a user with invalid data", async () => {
    const response = await request(app).post('/user/signup').send({
      name: 'Rafaella',
      lastName: 'Carra',
      email: 'rafaella.bad.password@example.com',
      password: '030345',
    });

    expect(response.status).toBe(400);
    expect(response.text).toMatch(/password/);
  });

  it("shouldn't create a user with missing fields", async () => {
    const response = await request(app).post('/user/signup').send({
      name: 'Rafaella',
      lastName: 'Carra',
      password: '0303456lalala',
    });

    expect(response.status).toBe(400);
    expect(response.text).toMatch(/Path `email` is required/);
  });

  it("shouldn't create a user with an invalid email format", async () => {
    const response = await request(app).post('/user/signup').send({
      name: 'Rafaella',
      lastName: 'Carra',
      email: 'rafaella.example',
      password: '0303456lalala',
    });

    console.log('THIS IS REPSONSE.TEXT--->', response.text);
    expect(response.status).toBe(400);
    expect(response.text).toMatch(/Path `email` is invalid/);
  });
});
