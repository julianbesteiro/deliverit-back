import { BadUserInputError } from '../errors/customErrors';

export async function validateDate(date: string) {
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;
  const convertedDate = new Date(date);

  const day = Number(date.slice(8, 10));
  const month = Number(date.slice(5, 7));
  const year = Number(date.slice(0, 4));

  const nextDay = new Date(date);

  nextDay.setDate(nextDay.getDate() + 1);

  if (!isNaN(convertedDate.getTime()) && iso8601Pattern.test(date.slice(0, 10))) {
    return { day, month, year, nextDay };
  } else {
    throw new BadUserInputError({ id: 'Date format is not valid' });
  }
}
