import mongoose, { Schema, UpdateQuery } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserDocument } from '../interfaces';

export const PasswordResetSchema: Schema = new Schema({
  token: { type: String, required: true },
  expiration: { type: Date, required: true },
});

export const userSchema: Schema = new mongoose.Schema(
  {
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
      unique: true,
      required: true,
    },
    passwordReset: PasswordResetSchema,
    urlImage: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/5249/5249427.png',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUserDocument>('save', function (next) {
  const user = this as IUserDocument;

  // Make sure not to rehash the password if it is already hashed
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt and use it to hash the user's password
  bcrypt.genSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return next(genSaltError);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.pre('findOneAndUpdate', function (next) {
  const update: UpdateQuery<IUserDocument> | null = this.getUpdate();

  if (update) {
    bcrypt.genSalt(10, (genSaltError, salt) => {
      if (genSaltError) {
        return next(genSaltError);
      }

      bcrypt.hash(update.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        update.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (password: string): Promise<boolean> {
  const user = this as IUserDocument;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (error, isMatch) => {
      if (error) {
        reject(error);
      }

      resolve(isMatch);
    });
  });
};
