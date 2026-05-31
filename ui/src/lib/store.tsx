'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Vehicle, Schedule, Driver } from './types';
import * as api from './api';

// ── Action types (same interface pages already use) ────────────────────────

export type Action =
  | { type: 'ADD_VEHICLE'; vehicle: Vehicle }
  | { type: 'DELETE_VEHICLE'; registrationNumber: string }
  | { type: 'ADD_RESERVATION'; registrationNumber: string; schedule: Schedule; driver: Driver }
  | { type: 'DELETE_RESERVATION'; registrationNumber: string; reservationId: string }
  | { type: 'CHANGE_RESERVATION'; registrationNumber: string; reservationId: string; newSchedule: Schedule };

interface State {
  vehicles: Vehicle[];
}

interface StoreContextValue {
  state: State;
  dispatch: (action: Action) => void;
  loading: boolean;
  apiError: string | null;
  refresh: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getVehicles();
      setVehicles(data);
      setApiError(null);
    } catch {
      setApiError('Cannot reach backend at http://localhost:5000. Start the API server first.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const dispatch = useCallback((action: Action) => {
    (async () => {
      try {
        switch (action.type) {
          case 'ADD_VEHICLE':
            await api.addVehicle(action.vehicle);
            break;
          case 'DELETE_VEHICLE':
            await api.deleteVehicle(action.registrationNumber);
            break;
          case 'ADD_RESERVATION':
            await api.addReservation(action.registrationNumber, action.schedule, action.driver);
            break;
          case 'CHANGE_RESERVATION':
            await api.updateReservation(action.registrationNumber, action.reservationId, action.newSchedule);
            break;
          case 'DELETE_RESERVATION':
            await api.deleteReservation(action.registrationNumber, action.reservationId);
            break;
        }
        await refresh();
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'API error');
      }
    })();
  }, [refresh]);

  return (
    <StoreContext.Provider value={{ state: { vehicles }, dispatch, loading, apiError, refresh }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
