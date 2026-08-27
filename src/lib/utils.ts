import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFee(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹ --';
  if (amount >= 100000) {
    const inLakhs = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${inLakhs} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatLpa(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
  return `₹${amount} LPA`;
}

export function getRatingColor(rating: number | null | undefined): string {
  if (!rating) return 'bg-gray-100 text-gray-700';
  if (rating >= 4.5) return 'bg-emerald-500 text-white';
  if (rating >= 4.0) return 'bg-green-600 text-white';
  if (rating >= 3.5) return 'bg-amber-500 text-white';
  return 'bg-orange-500 text-white';
}
