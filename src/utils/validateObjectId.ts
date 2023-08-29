const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const validateObjectId = (id: string): boolean => {
  if (!id || !objectIdPattern.test(id)) {
    return false;
  }
  return true;
};
