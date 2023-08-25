import mongoose, { Model } from 'mongoose';
import { connect } from '../../../config/db/db';
import { userSchema } from '../../../src/schemas';
import { IUserDocument } from '../../../src/interfaces';
import { CustomError } from '../../../src/errors/customErrors';

describe('User Schema Validation', () => {
  let User: Model<IUserDocument>;

  beforeAll(async () => {
    await connect();
    User = mongoose.model<IUserDocument>('User', userSchema) as Model<IUserDocument>;
  });

  it('should require a name', async () => {
    const user = new User({
      lastName: 'Carra',
      email: 'rafaella@example.com',
      password: '0303456lalala',
    } as IUserDocument);

    let err: CustomError | null = null;

    try {
      await user.validate();
    } catch (error) {
      err = error as CustomError;
    }

    expect(err?.message).toBeDefined();
    expect(err?.statusCode).toBe(400);
  });
});
