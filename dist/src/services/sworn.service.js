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
class SwornService {
    constructor(signwornRepository) {
        this.signwornRepository = signwornRepository;
    }
    createSworn(sworn) {
        return __awaiter(this, void 0, void 0, function* () {
            const newSworn = yield this.signwornRepository.create(sworn);
            return newSworn;
        });
    }
    deleteSworn(swornId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedSworn = yield this.signwornRepository.delete(swornId);
            return deletedSworn;
        });
    }
}
exports.default = SwornService;
