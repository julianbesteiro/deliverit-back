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
exports.UserService = void 0;
const tokens_1 = require("../utils/tokens");
const repository_1 = require("../repository");
const customErrors_1 = require("../errors/customErrors");
class UserService {
    static userServiceTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //logica random
                const maxUsers = id + 100;
                const userRepositoryData = yield repository_1.UserRepository.userRepositoryTest(maxUsers);
                console.log('test service');
                return userRepositoryData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getUserData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield repository_1.UserRepository.findUserById(id);
            if (!user) {
                throw new customErrors_1.UnauthorizedError('User not found');
            }
            return {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                enabled: user.enabled,
                lastSeenAt: user.lastSeenAt,
                urlImage: user.urlImage,
            };
        });
    }
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.UserRepository.createUser(user);
        });
    }
    static loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield repository_1.UserRepository.findUserByEmail(email);
            if (!user) {
                throw new customErrors_1.UnauthorizedError('User not found');
            }
            const isMatch = yield user.checkPassword(password);
            if (!isMatch) {
                throw new customErrors_1.UnauthorizedError('Invalid password');
            }
            const token = (0, tokens_1.generateToken)({ id: user._id });
            return token;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            //TO DO: Implement this
            throw new Error('Not implemented yet');
        });
    }
}
exports.UserService = UserService;
