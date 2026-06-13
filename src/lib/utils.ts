import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const gespreksTypeLabels: Record<string, string> = {
  functioneringsgesprek: 'Functioneringsgesprek',
  correctiegesprek: 'Correctiegesprek',
  motivatiegesprek: 'Motivatiegesprek',
  conflictgesprek: 'Conflictgesprek',
  verzuimgesprek: 'Verzuimgesprek',
  ontwikkelgesprek: 'Ontwikkelgesprek',
  exitgesprek: 'Exitgesprek',
  overig: 'Overig gesprek',
};

export const gevoeligheidLabels: Record<string, string> = {
  laag: 'Laag',
  gemiddeld: 'Gemiddeld',
  hoog: 'Hoog',
  zeer_hoog: 'Zeer hoog',
};

export const gevoeligheidColors: Record<string, string> = {
  laag: 'text-success-DEFAULT bg-success-light',
  gemiddeld: 'text-warning-DEFAULT bg-warning-light',
  hoog: 'text-danger-DEFAULT bg-danger-light',
  zeer_hoog: 'text-danger-DEFAULT bg-danger-light',
};
