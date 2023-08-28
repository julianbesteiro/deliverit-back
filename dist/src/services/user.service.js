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
const repository_1 = require("../repository");
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
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.UserRepository.createUser(user);
        });
    }
}
exports.UserService = UserService;
