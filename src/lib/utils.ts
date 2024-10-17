import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isAddress } from 'thirdweb';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isZodAddress = z
  .string()
  .refine(isAddress, { message: 'Invalid address' });

export function formatNumberWithCommas(number: number | string) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const truncate = (str: string, n: number = 100) => {
  if (!str) return '';
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};
