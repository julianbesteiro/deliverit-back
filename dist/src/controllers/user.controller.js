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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
const asyncHandler_1 = require("../utils/asyncHandler");
const customErrors_1 = require("../errors/customErrors");
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.userControllerTest = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userServiceData = yield services_1.UserService.userServiceTest(1);
    return res.status(200).send({
        status: 200,
        message: 'Test Controller OK',
        users: userServiceData,
    });
}));
UserController.getUserData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (!user)
        throw new customErrors_1.UnauthorizedError('Unauthorized');
    const userData = yield services_1.UserService.getUserData(user.id);
    return res.status(200).send(userData);
}));
UserController.createUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.UserService.createUser(req.body);
    return res.status(201).send('Created Successfully');
}));
UserController.loginUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (email === undefined || password === undefined)
        throw new customErrors_1.ValidationError('Missing fields');
    const token = yield services_1.UserService.loginUser(email, password);
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).send({ message: 'Login Successful' });
}));
UserController.logoutUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Authorization', '');
    return res.status(200).send({ message: 'Logout Successful' });
}));
UserController.requestPasswordReset = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (email === undefined)
        throw new customErrors_1.ValidationError('Missing fields');
    yield services_1.UserService.forgotPassword(email);
    return res.status(200).send({ message: 'Email sent' });
}));
UserController.verifyResetToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, token } = req.body;
    if (email === undefined || token === undefined)
        throw new customErrors_1.ValidationError('Missing fields');
    const isValid = yield services_1.UserService.verifyResetToken(email, token);
    return res.status(200).send({ isValid });
}));
UserController.resetPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, token, newPassword } = req.body;
    if (email === undefined || token === undefined || newPassword === undefined)
        throw new customErrors_1.ValidationError('Missing fields');
    yield services_1.UserService.resetPassword(email, token, newPassword);
    return res.status(200).send({ message: 'Password reset successful' });
}));
