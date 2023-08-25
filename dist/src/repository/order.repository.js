"use strict";
/* import { Request, Response } from 'express';
import { updateOrderService } from '../services/order.service';

export const updateOrder = async (req: Request, res: Response) => {
  try {
    await updateOrderService(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar la orden' });
  }
}; */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const db_1 = require("../../config/db");
class OrderRepository {
    static orderRepositoryTest(maxOrders) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db.connect();
                const allOrders = yield Order_1.default.find().limit(maxOrders);
                db_1.db.disconnect();
                console.log('test repository');
                return allOrders;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db.connect();
                const newOrder = yield Order_1.default.create(order);
                db_1.db.disconnect();
                return newOrder;
            }
            catch (error) {
                console.log('ESTE ES EL ERROR DE LA DB---->', error);
                throw error;
            }
        });
    }
}
exports.OrderRepository = OrderRepository;
