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
UserController.createUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.UserService.createUser(req.body);
    return res.status(201).send(user);
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
UserController.loginUser = (0, asyncHandler_1.asyncHandler)((req, res) => {
    // TODO: Implement this
    throw new Error('Not implemented yet');
});
