"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const customErrors_1 = require("../errors/customErrors");
const config_1 = __importDefault(require("../../config/config"));
const generateToken = (payload) => {
    const secret = config_1.default.jwt.access_token.secret;
    const token = (0, jsonwebtoken_1.sign)({ user: { id: payload.id } }, secret, {
        expiresIn: '20d',
    });
    if (!token)
        throw new customErrors_1.CustomError('Token is expired or invalid', 401);
    return token;
};
exports.generateToken = generateToken;
const validateToken = (token) => {
    const user = (0, jsonwebtoken_1.verify)(token, config_1.default.jwt.access_token.secret);
    return user;
};
exports.validateToken = validateToken;
