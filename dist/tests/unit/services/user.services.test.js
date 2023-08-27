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
const customErrors_1 = require("../../../src/errors/customErrors");
const repository_1 = require("../../../src/repository");
const services_1 = require("../../../src/services");
jest.mock('../../../src/repository/user.repository');
repository_1.UserRepository.createUser = jest.fn();
describe('UserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('createUser', () => {
        it('should successfully create a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = {
                name: 'Rafaella',
                lastName: 'Carra',
                email: 'rafaella@example.com',
                password: '0303456lalala',
                urlImage: 'http://example.com',
            };
            const mockDbUserResponse = {
                name: 'Rafaella',
                lastName: 'Carra',
                email: 'rafaella@example.com',
                role: 'user',
                enabled: true,
                lastSeenAt: new Date(),
                urlImage: 'http://example.com',
                password: 'hashedPassword123',
            };
            repository_1.UserRepository.createUser.mockResolvedValue(mockDbUserResponse);
            const user = yield services_1.UserService.createUser(mockUserData);
            expect(user).toEqual(mockDbUserResponse);
        }));
        it("should throw a ConflictError if the user's email already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            repository_1.UserRepository.createUser.mockRejectedValue(new customErrors_1.ConflictError('Email already exists'));
            yield expect(services_1.UserService.createUser({ email: 'rafaella@example.com' })).rejects.toThrow(customErrors_1.ConflictError);
        }));
    });
});
