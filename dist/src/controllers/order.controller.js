"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const services_1 = require("../services");
function isCustomError(error) {
    return error.name !== undefined || error.code !== undefined;
}
class OrderController {
    static orderControllerTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderServiceData = yield services_1.OrderService.orderServiceTest(1);
                return res.status(200).send({
                    status: 200,
                    message: 'Test Controller OK',
                    order: orderServiceData,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield services_1.OrderService.createOrder(req.body);
                return res.status(201).send(order);
            }
            catch (error) {
                let statusCode = 500;
                let message = 'An unexpected error occurred.';
                if (isCustomError(error)) {
                    if (error.name === 'ValidationError') {
                        statusCode = 400;
                        message = error.message;
                    }
                    else if (error.code === 11000) {
                        statusCode = 409;
                        message = 'Order already exists.';
                    }
                }
                else {
                    console.log(error);
                }
                res.status(statusCode).send({ message, error });
                next(error);
            }
        });
    }
}
exports.OrderController = OrderController;
