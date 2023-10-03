"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.PasswordResetSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.PasswordResetSchema = new mongoose_1.Schema({
    token: { type: String, required: true },
    expiration: { type: Date, required: true },
});
exports.userSchema = new mongoose_1.default.Schema({
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
    passwordReset: exports.PasswordResetSchema,
    urlImage: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/5249/5249427.png',
    },
    enabled: {
        type: Boolean,
        default: false,
    },
    blockUntil: {
        type: Date,
        default: null,
    },
    numberOfPacakagesPerDay: {
        type: Number,
        default: 0,
    },
    lastSeenAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.userSchema.pre('save', function (next) {
    const user = this;
    // Make sure not to rehash the password if it is already hashed
    if (!user.isModified('password')) {
        return next();
    }
    // Generate a salt and use it to hash the user's password
    bcrypt_1.default.genSalt(10, (genSaltError, salt) => {
        if (genSaltError) {
            return next(genSaltError);
        }
        bcrypt_1.default.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
exports.userSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update && update.password) {
        bcrypt_1.default.genSalt(10, (genSaltError, salt) => {
            if (genSaltError) {
                return next(genSaltError);
            }
            bcrypt_1.default.hash(update.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                update.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
exports.userSchema.methods.checkPassword = function (password) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(password, user.password, (error, isMatch) => {
            if (error) {
                reject(error);
            }
            resolve(isMatch);
        });
    });
};
