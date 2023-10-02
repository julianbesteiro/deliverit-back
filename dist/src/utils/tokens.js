"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const customErrors_1 = require("../errors/customErrors");
const config_1 = __importDefault(require("../../config/config"));
const getSecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return (midnight.getTime() - now.getTime()) / 1000;
};
const generateToken = (payload) => {
    const secret = config_1.default.jwt.access_token.secret;
    const expirationTime = Math.floor(getSecondsUntilMidnight());
    try {
        const token = (0, jsonwebtoken_1.sign)({ user: payload }, secret, {
            expiresIn: expirationTime,
        });
        return token;
    }
    catch (error) {
        throw new customErrors_1.CustomError('Error generating token', 500);
    }
};
exports.generateToken = generateToken;
const validateToken = (token) => {
    const user = (0, jsonwebtoken_1.verify)(token, config_1.default.jwt.access_token.secret);
    return user;
};
exports.validateToken = validateToken;
