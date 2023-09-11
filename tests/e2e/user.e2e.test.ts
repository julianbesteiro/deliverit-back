import express from 'express';
import request from 'supertest';
import { UserController } from '../../src/controllers';
import { connect, disconnect } from '../../config/db/db';
import User from '../../src/models/User';
import { errorHandler } from '../../src/middlewares/errorHandler';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

const app = express();
app.use(express.json());
app.post('/user/request-password-reset', UserController.requestPasswordReset);
app.post('/user/login', UserController.loginUser);
app.post('/user/logout', UserController.logoutUser);
app.get('/user/me', UserController.getUserData);
app.post('/user/signup', UserController.createUser);
app.use(errorHandler);

let token: string;

describe('User Endpoints', () => {
  beforeAll(async () => {
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

      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Path `email` is invalid/);
    });
  });

  describe('POST /user/login', () => {
    let res: request.Response;
    beforeAll(async () => {
      res = await request(app).post('/user/login').send({
        email: 'rafaella@example.com',
        password: '0303456lalala',
      });
      token = res.headers['authorization'].split(' ')[1];
    });
    it('should login successfully with valid credentials', async () => {
      expect(res.status).toBe(200);
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
      expect(response.text).toMatch('User not found');
    });

    it("shouldn't login with invalid credentials", async () => {
      const response = await request(app).post('/user/login').send({
        email: 'rafaella@example.com',
        password: '0303456lalala-lala-lala',
      });

      expect(response.status).toBe(401);
      expect(response.text).toMatch('Invalid password');
    });

    it("shouldn't login with missing fields", async () => {
      const response = await request(app).post('/user/login').send({
        email: 'rafaella@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.text).toMatch('Missing fields');
    });
  });

  describe('POST /user/request-password-reset', () => {
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

  describe('POST /user/logout', () => {
    let res: request.Response;
    beforeAll(async () => {
      const res = await request(app).post('/user/login').send({
        email: 'rafaella@example.com',
        password: '0303456lalala',
      });
      token = res.headers['authorization'].split(' ')[1];
    });
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/user/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Logout Successful');
    });

    it("shouldn't access protected routes after logout", async () => {
      const response = await request(app)
        //REPLACE FOR ANY PROTECTED ROUTE
        .get('/user/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.text).toMatch(/Unauthorized/);
    });
  });
});
