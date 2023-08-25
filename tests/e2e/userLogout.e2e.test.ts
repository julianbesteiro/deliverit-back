import request from 'supertest';
import express from 'express';
import { UserController } from '../../src/controllers';
import { connect, disconnect } from '../../config/db/db';
import User from '../../src/models/User';

const app = express();
app.use(express.json());

let token: string;

describe('POST /user/logout', () => {
  beforeAll(async () => {
    await connect();
    await User.create({
      name: 'Rafaella',
      lastName: 'Carra',
      email: 'rafaella@example.com',
      password: '0303456lalala',
    });
    const res = await request(app).post('/user/login').send({
      email: 'rafaella@example.com',
      password: '0303456lalala',
    });
    token = res.body.token;
  });

  afterAll(async () => {
    await connect();
    await User.deleteOne({ email: 'rafaella@example.com' });
    await disconnect();
  }, 10000);

  it('should logout user successfully', async () => {
    const response = await request(app)
      .post('/user/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User logged out successfully');
  });

  it("shouldn't access protected routes after logout", async () => {
    const response = await request(app)
      //REPLACE FOR ANY PROTECTED ROUTE
      .get('/secret')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.text).toMatch(/Unauthorized/);
  });
});
