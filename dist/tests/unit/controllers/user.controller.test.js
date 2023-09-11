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
const user_controller_1 = require("../../../src/controllers/user.controller");
const customErrors_1 = require("../../../src/errors/customErrors");
const user_service_1 = require("../../../src/services/user.service");
const mocks_1 = require("../../utils/mocks");
jest.mock('../../../src/services/user.service');
user_service_1.UserService.loginUser = jest.fn();
user_service_1.UserService.forgotPassword = jest.fn();
describe('UserController', () => {
    const mockNext = jest.fn();
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('createUser', () => {
        const mockUserData = {
            id: 1,
            name: 'Rafaella',
            lastName: 'Carra',
            email: 'rafaella@example.com',
            role: 'user',
            enabled: true,
            lastSeenAt: new Date(),
            urlImage: 'http://example.com',
        };
        const req = (0, mocks_1.mockRequest)({ body: mockUserData });
        const res = (0, mocks_1.mockResponse)();
        it('should create a user and return `Created Successfully`', () => __awaiter(void 0, void 0, void 0, function* () {
            user_service_1.UserService.createUser.mockResolvedValue(mockUserData);
            yield user_controller_1.UserController.createUser(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('Created Successfully');
        }));
        it('should propagate conflict error when creating a user with an existing email', () => __awaiter(void 0, void 0, void 0, function* () {
            const conflictError = new customErrors_1.ConflictError('Email already exists');
            user_service_1.UserService.createUser.mockRejectedValue(conflictError);
            yield user_controller_1.UserController.createUser(req, res, mockNext);
            expect(mockNext).toHaveBeenCalledWith(conflictError);
        }));
    });
    describe('loginUser', () => {
        it('should login a user and return a token', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = {
                email: 'rafaella@example.com',
                password: '0303456lalala',
                token: 'sampleToken',
            };
            const req = (0, mocks_1.mockRequest)({ body: mockUserData });
            const res = (0, mocks_1.mockResponse)();
            user_service_1.UserService.loginUser.mockResolvedValue(mockUserData.token);
            yield user_controller_1.UserController.loginUser(req, res, mockNext);
            expect(res.setHeader).toHaveBeenCalledWith('Authorization', `Bearer ${mockUserData.token}`);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Login Successful' });
        }));
        it("shouldn't login a user with incorrect credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = {
                email: 'rafaella@example.com',
                password: 'wrongPassword',
            };
            const req = (0, mocks_1.mockRequest)({ body: mockUserData });
            const res = (0, mocks_1.mockResponse)();
            const authError = new Error('Invalid credentials');
            user_service_1.UserService.loginUser.mockRejectedValue(authError);
            yield user_controller_1.UserController.loginUser(req, res, mockNext);
            expect(mockNext).toHaveBeenCalledWith(authError);
        }));
    });
    describe('requestPasswordReset', () => {
        const mockUserData = {
            email: 'rafaella@example.com',
        };
        const req = (0, mocks_1.mockRequest)({ body: mockUserData });
        const res = (0, mocks_1.mockResponse)();
        it('Should send a reset email and return a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            user_service_1.UserService.forgotPassword.mockResolvedValue(true);
            yield user_controller_1.UserController.requestPasswordReset(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Email sent' });
        }));
        it('should handle errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            user_service_1.UserService.forgotPassword.mockRejectedValue(new Error('Error sending email'));
            yield user_controller_1.UserController.requestPasswordReset(req, res, mockNext);
            expect(mockNext).toHaveBeenCalledWith(new Error('Error sending email'));
        }));
    });
    describe('verifyResetToken', () => {
        const mockUserData = {
            email: 'rafaella@example.com',
            token: 'sampleToken',
        };
        const req = (0, mocks_1.mockRequest)({ body: mockUserData });
        const res = (0, mocks_1.mockResponse)();
        it('Should verify a reset token and return its validity', () => __awaiter(void 0, void 0, void 0, function* () {
            user_service_1.UserService.verifyResetToken.mockResolvedValue(true);
            yield user_controller_1.UserController.verifyResetToken(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ isValid: true });
        }));
        it('should return false if the token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            user_service_1.UserService.verifyResetToken.mockResolvedValue(false);
            yield user_controller_1.UserController.verifyResetToken(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ isValid: false });
        }));
    });
    describe('resetPassword', () => {
        const mockUserData = {
            email: 'rafaella@example.com',
            token: 'sampleToken',
            newPassword: 'newPassword',
        };
        const req = (0, mocks_1.mockRequest)({ body: mockUserData });
        const res = (0, mocks_1.mockResponse)();
        it('Should reset a password and return a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            user_service_1.UserService.resetPassword.mockResolvedValue(true);
            yield user_controller_1.UserController.resetPassword(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Password reset successfully' });
        }));
        it('should handle errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            user_service_1.UserService.resetPassword.mockRejectedValue(new Error('Error resetting password'));
            yield user_controller_1.UserController.resetPassword(req, res, mockNext);
            expect(mockNext).toHaveBeenCalledWith(new Error('Error resetting password'));
        }));
    });
});
