"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const express_1 = require("express");
const user_routes_1 = require("./user.routes");
const admin_routes_1 = require("./admin.routes");
const order_routes_1 = require("./order.routes");
const delivery_routes_1 = require("./delivery.routes");
const sworn_routes_1 = require("./sworn.routes");
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const router = (0, express_1.Router)();
exports.allRoutes = router;
router.use('/user', user_routes_1.userRoutes);
router.use('/order', isAuth_1.default, order_routes_1.allRoutes);
router.use('/admin', isAuth_1.default, isAdmin_1.default, admin_routes_1.adminRoutes);
router.use('/delivery', isAuth_1.default, delivery_routes_1.deliveryRouter);
router.use('/sworn', isAuth_1.default, sworn_routes_1.swornRouter);
