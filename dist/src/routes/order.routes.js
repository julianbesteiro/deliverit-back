"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.allRoutes = router;
router.get('/', controllers_1.OrderController.orderControllerTest);
router.post('/', controllers_1.OrderController.createOrder);
