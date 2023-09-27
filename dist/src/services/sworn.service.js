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
const repository_1 = require("../repository");
class SwornService {
    constructor(signSwornRepository) {
        this.signSwornRepository = signSwornRepository;
    }
    createSworn(sworn) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check if any of the conditions is true
            const hasIssue = sworn.alcoholicBeverages || sworn.psychoactiveMedication || sworn.familyProblem;
            //Determine the sworn statement status and user's enabled status based on the conditions
            const swornStatementStatus = hasIssue ? 'rejected' : 'approved';
            const enabled = !hasIssue;
            //Update the Sworn model with the swornStatementStatus
            sworn.swornStatementStatus = swornStatementStatus;
            const newSworn = yield this.signSwornRepository.create(sworn);
            //Update the User model with the enabled status and set blockUntil
            const blockUntil = hasIssue ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;
            const updatedUser = yield repository_1.UserRepository.updateUserById(sworn.userId, { enabled, blockUntil });
            //Implement logic to update the deliveries and orders status if the sworn statement is rejected
            return { sworn: newSworn, updatedUser };
        });
    }
    deleteSworn(swornId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedSworn = yield this.signSwornRepository.delete(swornId);
            return deletedSworn;
        });
    }
}
exports.default = SwornService;
