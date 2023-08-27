"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = require("jsonwebtoken");
const tokens_1 = require("../utils/tokens");
const isAuth = (req, res, next) => {
    var _a;
    // token looks like 'Bearer vnjaknvijdaknvikbnvreiudfnvriengviewjkdsbnvierj'
    try {
        const authHeader = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!authHeader || !(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            return res.sendStatus(http_status_1.default.UNAUTHORIZED);
        }
        const token = authHeader.split(' ')[1];
        if (!token)
            return res.sendStatus(http_status_1.default.UNAUTHORIZED);
        const payload = (0, tokens_1.validateToken)(token);
        if (!payload || typeof payload === 'string')
            return res.sendStatus(http_status_1.default.UNAUTHORIZED);
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.sendStatus(http_status_1.default.UNAUTHORIZED);
        }
        next(err);
    }
};
exports.default = isAuth;
