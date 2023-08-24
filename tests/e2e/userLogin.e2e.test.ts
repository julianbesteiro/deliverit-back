import request from 'supertest';
import express from 'express';
import User from '../../src/models/User';
import { UserController } from '../../src/controllers';
import { connect, disconnect } from '../../config/db/db';

const app = express();
app.use(express.json());
app.post('/user/signup', UserController.loginUser);

beforeAll(async () => {
  await connect();
  await User.create({
    name: 'Rafaella',
    lastName: 'Carra',
    email: 'rafaella@example.com',
    password: '0303456lalala',
  });
});

afterAll(async () => {
  await connect();
  await User.deleteOne({ email: 'rafaella@example.com' });
  await disconnect();
}, 10000);

describe('POST /user/login', () => {
  it('should login successfully with valid credentials', async () => {
    const response = await request(app).post('/user/login').send({
      email: 'rafaella@example.com',
      password: '0303456lalala',
    });

    expect(response.status).toBe(200);

    const token = response.headers['authorization'].split(' ')[1];

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it("shouldn't login with a non-existing email", async () => {
    const response = await request(app).post('/user/login').send({
      email: 'nonexistentrafaella@example.com',
      password: '0303456lalala',
    });

    expect(response.status).toBe(401);
    expect(response.text).toMatch(/Invalid credentials/);
  });

  it("shouldn't login with invalid credentials", async () => {
    const response = await request(app).post('/user/login').send({
      email: 'rafaella@example.com',
      password: '0303456lalala-lala-lala',
    });

    expect(response.status).toBe(401);
    expect(response.text).toMatch(/Invalid credentials/);
  });

  it("shouldn't login with missing fields", async () => {
    const response = await request(app).post('/user/login').send({
      email: 'rafaella@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.text).toMatch(/password/);
  });
});
