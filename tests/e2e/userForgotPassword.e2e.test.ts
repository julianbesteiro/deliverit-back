import express from 'express';
import request from 'supertest';
import { connect, disconnect } from '../../config/db/db';
import User from '../../src/models/User';
import { UserController } from '../../src/controllers';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

const app = express();
app.use(express.json());
app.post('/user/request-password-reset', UserController.requestPasswordReset);

describe('POST /user/request-password-reset', () => {
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

  it('should send a reset email and return a success message', async () => {
    const response = await request(app).post('/user/request-password-reset').send({
      email: 'rafaella@example.com',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.text).toMatch(/Email sent/);
  });

  it("shouldn't send a code to a non-existing email", async () => {
    const response = await request(app).post('/user/request-password-reset').send({
      email: 'non-existent@example.com',
    });

    expect(response.status).toBe(401);
    expect(response.text).toMatch(/User not found/);
  });
});
