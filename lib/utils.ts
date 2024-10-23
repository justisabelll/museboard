import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(password: string) {
  return await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 6 });
}

export async function verifyPassword(password: string, hash: string) {
  return await Bun.password.verify(password, hash);
}
