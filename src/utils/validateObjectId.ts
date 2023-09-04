const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const validateObjectId = (id: string): boolean => {
  if (!id || !objectIdPattern.test(id)) {
    return false;
  }
  return true;
};

//eslint-disable-next-line
export function hasDuplicates(arr: any[], property: string): boolean {
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
