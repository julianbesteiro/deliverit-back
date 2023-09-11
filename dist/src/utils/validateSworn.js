"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSwornInput = void 0;
const customErrors_1 = require("../errors/customErrors");
function validateSwornInput(sworn) {
    const errors = [];
    // Valida que el sworneto tenga todas las propiedades requeridas
    const requiredFields = ['alcoholicBeverages', 'psychoactiveMedication', 'familyProblem'];
    for (const field of requiredFields) {
        if (!(field in sworn)) {
            errors.push(`${field} is missing`);
        }
    }
    // Valida el formato de cada campo
    if (sworn.alcoholicBeverages !== true && sworn.alcoholicBeverages !== false) {
        errors.push(new customErrors_1.BadUserInputError({ message: 'alcoholicBeverages is not a valid boolean' }));
    }
    if (sworn.psychoactiveMedication !== true && sworn.psychoactiveMedication !== false) {
        errors.push(new customErrors_1.BadUserInputError({ message: 'psychoactiveMedication is not a valid boolean' }));
    }
    if (sworn.familyProblem !== true && sworn.familyProblem !== false) {
        errors.push(new customErrors_1.BadUserInputError({ message: 'familyProblem is not a valid boolean' }));
    }
    if (errors.length > 0) {
        throw errors;
    }
    return sworn;
}
exports.validateSwornInput = validateSwornInput;
