"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("@/controllers");
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const router = (0, express_1.Router)();
exports.userRoutes = router;
router.get('/me', isAuth_1.default, controllers_1.UserController.getUserData);
router.get('/', controllers_1.UserController.userControllerTest);
router.post('/signup', controllers_1.UserController.createUser);
router.post('/login', controllers_1.UserController.loginUser);
router.post('/forgot-password', controllers_1.UserController.forgotPassword);
