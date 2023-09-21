"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = require("jsonwebtoken");
const isAdmin = (req, res, next) => {
    try {
        if (req.user &&
            req.user.role === 'admin') {
            next();
        }
        else {
            return res.sendStatus(http_status_1.default.UNAUTHORIZED);
        }
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.sendStatus(http_status_1.default.UNAUTHORIZED);
        }
        next(err);
    }
};
exports.default = isAdmin;
