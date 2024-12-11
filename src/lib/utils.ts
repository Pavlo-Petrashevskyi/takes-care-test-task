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