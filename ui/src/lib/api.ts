import { Vehicle, Schedule, Driver, Reservation } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Vehicles ──────────────────────────────────────────────────────────────

export function getVehicles(): Promise<Vehicle[]> {
  return request('/api/vehicles');
}

export function getVehicle(reg: string): Promise<Vehicle> {
  return request(`/api/vehicles/${reg}`);
}

export function getAvailableVehicles(pickupDate: string, dropoffDate: string, type?: string): Promise<Vehicle[]> {
  const params = new URLSearchParams({ from: pickupDate, to: dropoffDate });
  if (type && type !== 'All') params.set('type', type);
  return request(`/api/vehicles/available?${params}`);
}

export function addVehicle(vehicle: Omit<Vehicle, 'reservations'>): Promise<Vehicle> {
  return request('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify(vehicle),
  });
}

export function deleteVehicle(reg: string): Promise<void> {
  return request(`/api/vehicles/${reg}`, { method: 'DELETE' });
}

// ── Reservations ─────────────────────────────────────────────────────────

export function addReservation(
  reg: string,
  schedule: Schedule,
  driver: Driver
): Promise<Reservation> {
  return request(`/api/vehicles/${reg}/reservations`, {
    method: 'POST',
    body: JSON.stringify({
      driver: {
        name: driver.name,
        surname: driver.surname,
        dateOfBirth: driver.dateOfBirth,
        licenseNumber: driver.licenseNumber,
      },
      schedule: {
        pickupDate: schedule.pickupDate,
        dropoffDate: schedule.dropoffDate,
      },
    }),
  });
}

export function updateReservation(
  reg: string,
  reservationId: string,
  schedule: Schedule
): Promise<void> {
  return request(`/api/vehicles/${reg}/reservations/${reservationId}`, {
    method: 'PUT',
    body: JSON.stringify({
      schedule: { pickupDate: schedule.pickupDate, dropoffDate: schedule.dropoffDate },
    }),
  });
}

export function deleteReservation(reg: string, reservationId: string): Promise<void> {
  return request(`/api/vehicles/${reg}/reservations/${reservationId}`, { method: 'DELETE' });
}

// ── Report ────────────────────────────────────────────────────────────────

export function getReport(): Promise<{ text: string }> {
  return request('/api/vehicles/report');
}
