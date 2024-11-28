import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const labelToValue = (label: string): string => {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_') // 将非字母数字字符替换为下划线
    .replace(/^_+|_+$/g, ''); // 移除首尾下划线
};
