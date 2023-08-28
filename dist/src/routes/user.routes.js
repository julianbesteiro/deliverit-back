"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.userRoutes = router;
router.get('/', controllers_1.UserController.userControllerTest);
router.post('/signup', controllers_1.UserController.createUser);
