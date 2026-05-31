import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Vehicle, Schedule } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function daysBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function schedulesOverlap(a: Schedule, b: Schedule): boolean {
  const aStart = new Date(a.pickupDate);
  const aEnd = new Date(a.dropoffDate);
  const bStart = new Date(b.pickupDate);
  const bEnd = new Date(b.dropoffDate);
  return aStart < bEnd && aEnd > bStart;
}

export function isVehicleAvailable(vehicle: Vehicle, schedule: Schedule): boolean {
  return !vehicle.reservations.some(r => schedulesOverlap(r.schedule, schedule));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);
}
