import mongoose, { CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  email: {
    type: String,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  picture: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/5249/5249427.png',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
  } catch (err) {
    return next(err as CallbackError);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default userSchema;
