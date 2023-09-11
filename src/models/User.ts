import mongoose, { Model } from 'mongoose';
import { IUserDocument } from '../interfaces';
import { userSchema } from '../schemas';

const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

export default UserModel;
