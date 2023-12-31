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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const controllers_1 = require("../../src/controllers");
const db_1 = require("../../config/db/db");
const User_1 = __importDefault(require("../../src/models/User"));
const errorHandler_1 = require("../../src/middlewares/errorHandler");
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(true),
    }),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/user/request-password-reset', controllers_1.UserController.requestPasswordReset);
app.post('/user/login', controllers_1.UserController.loginUser);
app.post('/user/logout', controllers_1.UserController.logoutUser);
app.get('/user/me', controllers_1.UserController.getUserData);
app.post('/user/signup', controllers_1.UserController.createUser);
app.use(errorHandler_1.errorHandler);
let token;
describe('User Endpoints', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connect)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connect)();
        yield User_1.default.deleteOne({ email: 'rafaella@example.com' });
        yield (0, db_1.disconnect)();
    }), 10000);
    describe('POST /user/signup', () => {
        const userData = {
            name: 'Rafaella',
            lastName: 'Carra',
            email: 'rafaella@example.com',
            password: '0303456lalala',
        };
        it('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/signup').send(userData);
            expect(response.status).toBe(201);
            expect(response.text).toBe('Created Successfully');
        }));
        it("shouldn't create a user with an existing email", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/signup').send(userData);
            expect(response.status).toBe(409);
            expect(response.text).toMatch('E11000 duplicate key error');
        }));
        it("shouldn't create a user with invalid data", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/signup').send({
                name: 'Rafaella',
                lastName: 'Carra',
                email: 'rafaella.bad.password@example.com',
                password: '030345',
            });
            expect(response.status).toBe(400);
            expect(response.text).toMatch(/password/);
        }));
        it("shouldn't create a user with missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/signup').send({
                name: 'Rafaella',
                lastName: 'Carra',
                password: '0303456lalala',
            });
            expect(response.status).toBe(400);
            expect(response.text).toMatch(/Path `email` is required/);
        }));
        it("shouldn't create a user with an invalid email format", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/signup').send({
                name: 'Rafaella',
                lastName: 'Carra',
                email: 'rafaella.example',
                password: '0303456lalala',
            });
            expect(response.status).toBe(400);
            expect(response.text).toMatch(/Path `email` is invalid/);
        }));
    });
    describe('POST /user/login', () => {
        let res;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            res = yield (0, supertest_1.default)(app).post('/user/login').send({
                email: 'rafaella@example.com',
                password: '0303456lalala',
            });
            token = res.headers['authorization'].split(' ')[1];
        }));
        it('should login successfully with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(res.status).toBe(200);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.').length).toBe(3);
        }));
        it("shouldn't login with a non-existing email", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/login').send({
                email: 'nonexistentrafaella@example.com',
                password: '0303456lalala',
            });
            expect(response.status).toBe(401);
            expect(response.text).toMatch('User not found');
        }));
        it("shouldn't login with invalid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/login').send({
                email: 'rafaella@example.com',
                password: '0303456lalala-lala-lala',
            });
            expect(response.status).toBe(401);
            expect(response.text).toMatch('Invalid password');
        }));
        it("shouldn't login with missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/login').send({
                email: 'rafaella@example.com',
            });
            expect(response.status).toBe(400);
            expect(response.text).toMatch('Missing fields');
        }));
    });
    describe('POST /user/request-password-reset', () => {
        it('should send a reset email and return a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/request-password-reset').send({
                email: 'rafaella@example.com',
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.text).toMatch(/Email sent/);
        }));
        it("shouldn't send a code to a non-existing email", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/user/request-password-reset').send({
                email: 'non-existent@example.com',
            });
            expect(response.status).toBe(401);
            expect(response.text).toMatch(/User not found/);
        }));
    });
    describe('POST /user/logout', () => {
        let res;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post('/user/login').send({
                email: 'rafaella@example.com',
                password: '0303456lalala',
            });
            token = res.headers['authorization'].split(' ')[1];
        }));
        it('should logout user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/user/logout')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Logout Successful');
        }));
        it("shouldn't access protected routes after logout", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                //REPLACE FOR ANY PROTECTED ROUTE
                .get('/user/me')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(401);
            expect(response.text).toMatch(/Unauthorized/);
        }));
    });
});
