"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    MAX_NUMBER_OF_PACKAGES_PER_DAY: process.env.MAX_NUMBER_OF_PACKAGES_PER_DAY || 10,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
    AWS_PUBLIC_KEY: process.env.AWS_PUBLIC_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
};
