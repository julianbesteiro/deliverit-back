"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.adminRoutes = router;
router.get('/date/workers', controllers_1.AdminController.workerDataByDate);
router.get('/workers/id', controllers_1.AdminController.workerDataById);
router.get('/date/orders', controllers_1.AdminController.orderDataByDate);
router.get('/date', controllers_1.AdminController.dataByDate);
router.post('/orders/create', controllers_1.AdminController.newOrder);
router.delete('/orders/delete/id', controllers_1.AdminController.orderToRemove);
router.put('/edit-status/id', controllers_1.AdminController.workerStatus);
