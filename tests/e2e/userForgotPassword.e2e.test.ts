import { connect, disconnect } from '../../config/db/db';
import User from '../../src/models/User';

describe('POST /user/forgot-password', () => {
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

  it("should send a code to the user's email", async () => {
    const response = await request(app).post('/user/forgot-password').send({
      email: 'rafaella@example.com',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Code sent to email');
  });

  it("shouldn't send a code to a non-existing email", async () => {
    const response = await request(app).post('/user/forgot-password').send({
      email: 'non-existent@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.text).toMatch(/Email not found/);
  });
});
