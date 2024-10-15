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
