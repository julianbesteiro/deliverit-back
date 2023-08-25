"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customErrors_1 = require("../errors/customErrors");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (err instanceof customErrors_1.CustomError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
    next();
};
exports.default = errorHandler;
