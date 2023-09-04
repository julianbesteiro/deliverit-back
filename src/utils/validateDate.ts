import { BadUserInputError } from '@/errors/customErrors';

export async function validateDate(date: string) {
  const unixTimestamp = Number(date);

  const timestampInMilliseconds = unixTimestamp * 1000;

  const convertedDate = new Date(timestampInMilliseconds);

  if (!isNaN(convertedDate.getTime()) && timestampInMilliseconds === convertedDate.getTime()) {
    return convertedDate;
  } else {
    throw new BadUserInputError({ id: 'Date format is not valid' });
  }
}

export async function validateCalendarDate(date: string) {
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;
  const convertedDate = new Date(date);

  if (!iso8601Pattern.test(date.slice(0, 10))) {
    throw new BadUserInputError({ id: 'Date format is not valid' });
  }

  if (isNaN(convertedDate.getTime())) {
    throw new BadUserInputError({ id: 'Date format is not valid' });
  }

  return true;
}
