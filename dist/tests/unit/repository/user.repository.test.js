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
const db_1 = require("../../../config/db/db");
const customErrors_1 = require("../../../src/errors/customErrors");
const repository_1 = require("../../../src/repository");
describe('UserRepository', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connect)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.disconnect)();
    }));
    describe('createUser', () => {
        it('should successfully create a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                name: 'Rafaella',
                lastName: 'Carra',
                email: 'rafaella@example.com',
                password: '0303456lalala',
                urlImage: 'http://example.com',
            };
            const createdUser = yield repository_1.UserRepository.createUser(user);
            expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.name).toBe(user.name);
            expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.lastName).toBe(user.lastName);
            expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.email).toBe(user.email);
            expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.role).toBe('user');
            expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.enabled).toBe(true);
            expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.lastSeenAt).toBeDefined();
            expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.urlImage).toBe(user.urlImage);
        }));
        it("should throw ConflictError if the user's email already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                name: 'Rafaella',
                lastName: 'Carra',
                email: 'rafaella@example.com',
                password: '0303456lalala',
                urlImage: 'http://example.com',
            };
            yield repository_1.UserRepository.createUser(user);
            yield expect(repository_1.UserRepository.createUser(user)).rejects.toThrow(customErrors_1.ConflictError);
        }));
        it('should throw ValidationError on invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidUser = {
                name: 'Rafaella',
                lastName: 'Carra',
            };
            yield expect(repository_1.UserRepository.createUser(invalidUser)).rejects.toThrow(customErrors_1.ValidationError);
        }));
    });
});
