import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetterAndRemoveDash(str: string) {
  return str.replace(/^./, str[0].toUpperCase()).replace('-', ' ');
}

export function countArrayOfHoursForFromHourField(dateOfVisit: Date | undefined) {
  const isToday = dateOfVisit && dateOfVisit.getDate() === moment().date();
  const todayHourToCeil = moment().add(1, 'hour').hour();
  const lastFromHour = 22;
  const step = 2;

  if (isToday) {
    return todayHourToCeil + step > lastFromHour
      ? []
      : Array.from({ length: lastFromHour - todayHourToCeil - step + 1}).map((_, i) => i + todayHourToCeil + step);
  }

  return Array.from({ length: lastFromHour + 1}).map((_, i) => i);
}

export function countArrayOfHoursForToHourField(fromHour: string | undefined) {
  const step = 1;
  const lastFromHour = 23;

  if (fromHour) {
    const toHourStart = +fromHour + step;
  
    return toHourStart > lastFromHour
      ? []
      : Array.from({ length: lastFromHour - toHourStart + 1}).map((_, i) => i + toHourStart);
  }

  return Array.from({ length: lastFromHour + step}).map((_, i) => i);
}

export function isValidPesel(pesel: string) {
  if (typeof pesel !== 'string') {
    return false;
  }

  const weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  const controlNumber = parseInt(pesel.substring(10, 11));

  for (let i = 0; i < weight.length; i++) {
      sum += (parseInt(pesel.substring(i, i + 1)) * weight[i]);
  }
  sum = sum % 10;
  return (10 - sum) % 10 === controlNumber;
}

export function countDateOfBirthUsingPesel(pesel: string) {
  if (!isValidPesel(pesel)) {
    return;
  }

  const peselArr = pesel.split('').map(number => parseInt(number));

 //Policz rok z uwzględnieniem XIX, XXI, XXII i XXIII wieku
  let year = 1900 + peselArr[0] * 10 + peselArr[1];

  if (peselArr[2] >= 2 && peselArr[2] < 8) {
    year += Math.floor(peselArr[2] / 2) * 100;
  }
  
  if (peselArr[2] >= 8 ) {
    year -= 100;
  }

  const month = (peselArr[2] % 2) * 10 + peselArr[3];
  const day = peselArr[4] * 10 + peselArr[5];

  //Sprawdź poprawność daty urodzenia
  if (!checkDate(day, month - 1, year)) {
    return; 
  }

  return new Date(year, month - 1, day);
}

function checkDate(d: number, m: number,y: number) {
  const dt = moment().year(y).month(m).date(d);

  return dt.date() === d && dt.month() === m && dt.year() === y;
}
