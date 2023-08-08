import mongoose, { Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  password: string;
  email: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: /^\S+@\S+.\S+$/,
    unique: true,
    required: true,
  },
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
