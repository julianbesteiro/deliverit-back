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
const User_1 = __importDefault(require("../../src/models/User"));
const controllers_1 = require("../../src/controllers");
const db_1 = require("../../config/db/db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/user/login', controllers_1.UserController.loginUser);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connect)();
    yield User_1.default.create({
        name: 'Rafaella',
        lastName: 'Carra',
        email: 'rafaella@example.com',
        password: '0303456lalala',
    });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connect)();
    yield User_1.default.deleteOne({ email: 'rafaella@example.com' });
    yield (0, db_1.disconnect)();
}), 10000);
describe('POST /user/login', () => {
    it('should login successfully with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/user/login').send({
            email: 'rafaella@example.com',
            password: '0303456lalala',
        });
        expect(response.status).toBe(200);
        const token = response.headers['authorization'].split(' ')[1];
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
