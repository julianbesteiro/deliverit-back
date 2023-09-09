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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../src/controllers");
const db_1 = require("../../config/db/db");
const User_1 = __importDefault(require("../../src/models/User"));
const middlewares_1 = require("@/middlewares");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/user/signup', controllers_1.UserController.createUser);
app.use(middlewares_1.errorHandler);
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
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
