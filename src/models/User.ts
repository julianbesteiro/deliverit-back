import mongoose, { Model } from 'mongoose';
import { IUser } from '../interfaces';
import { userSchema } from '../schemas';

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
