"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDuplicates = exports.validateObjectId = void 0;
const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const validateObjectId = (id) => {
    if (!id || !objectIdPattern.test(id)) {
        return false;
    }
    return true;
};
exports.validateObjectId = validateObjectId;
//eslint-disable-next-line
function hasDuplicates(arr, property) {
    const seenValues = new Set();
    for (const element of arr) {
        const propertyValue = element[property];
        if (seenValues.has(propertyValue)) {
            // Found a duplicate
            return true;
        }
        // Add the value to the seen values
        seenValues.add(propertyValue);
    }
    // No duplicates found
    return false;
}
exports.hasDuplicates = hasDuplicates;
