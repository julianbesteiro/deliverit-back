import { BadUserInputError } from '../errors/customErrors';
import { ISworn } from '../interfaces';

export function validateSwornInput(sworn: ISworn): ISworn {
  const errors = [];

  // Validate that sword has all required properties
  const requiredFields = ['alcoholicBeverages', 'psychoactiveMedication', 'familyProblem'];
  for (const field of requiredFields) {
    if (!(field in sworn)) {
      errors.push(`${field} is missing`);
    }
  }

  // Validate each field format
  if (sworn.alcoholicBeverages !== true && sworn.alcoholicBeverages !== false) {
    errors.push(new BadUserInputError({ message: 'alcoholicBeverages is not a valid boolean' }));
  }

  if (sworn.psychoactiveMedication !== true && sworn.psychoactiveMedication !== false) {
    errors.push(
      new BadUserInputError({ message: 'psychoactiveMedication is not a valid boolean' }),
    );
  }

  if (sworn.familyProblem !== true && sworn.familyProblem !== false) {
    errors.push(new BadUserInputError({ message: 'familyProblem is not a valid boolean' }));
  }

  if (errors.length > 0) {
    throw errors;
  }

  return sworn;
}
