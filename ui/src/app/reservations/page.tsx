'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { RequireAuth } from '@/components/auth/require-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { formatDate, formatCurrency, daysBetween } from '@/lib/utils';
import { Vehicle, Reservation } from '@/lib/types';
import { Calendar, Car, Edit2, Trash2, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { VehicleTypeIcon } from '@/components/vehicles/vehicle-type-icon';

interface FlatReservation {
  vehicle: Vehicle;
  reservation: Reservation;
}

export default function ReservationsPage() {
  const { state, dispatch } = useStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<FlatReservation | null>(null);
  const [newPickup, setNewPickup] = useState('');
  const [newDropoff, setNewDropoff] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const allReservations: FlatReservation[] = state.vehicles.flatMap(v =>
    v.reservations.map(r => ({ vehicle: v, reservation: r }))
  );

  function openEdit(item: FlatReservation) {
    setSelected(item);
    setNewPickup(item.reservation.schedule.pickupDate);
    setNewDropoff(item.reservation.schedule.dropoffDate);
    setError('');
    setEditOpen(true);
  }

  function openDelete(item: FlatReservation) {
    setSelected(item);
    setDeleteOpen(true);
  }

  function handleEdit() {
    if (!selected) return;
    if (!newPickup || !newDropoff) { setError('Select both dates.'); return; }
    if (newPickup >= newDropoff) { setError('Dropoff must be after pickup.'); return; }

    dispatch({
      type: 'CHANGE_RESERVATION',
      registrationNumber: selected.vehicle.registrationNumber,
      reservationId: selected.reservation.id,
      newSchedule: { pickupDate: newPickup, dropoffDate: newDropoff },
    });
    setSuccessMsg('Reservation updated!');
    setTimeout(() => { setEditOpen(false); setSuccessMsg(''); }, 1200);
  }

  function handleDelete() {
    if (!selected) return;
    dispatch({
      type: 'DELETE_RESERVATION',
      registrationNumber: selected.vehicle.registrationNumber,
      reservationId: selected.reservation.id,
    });
    setDeleteOpen(false);
    setSelected(null);
  }

  return (
    <RequireAuth role="customer">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-1">My Bookings</p>
        <h1 className="text-4xl font-black text-white mb-2">Reservations</h1>
        <p className="text-slate-400">View, modify, or cancel your vehicle bookings</p>
      </div>

      {allReservations.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-16 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">No reservations yet</p>
          <p className="text-slate-400 text-sm mb-6">Browse our fleet and book your first vehicle</p>
          <Button asChild>
            <Link href="/customer" className="flex items-center gap-2">Browse Fleet <ChevronRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {allReservations.map(({ vehicle, reservation }) => {
            const days = daysBetween(reservation.schedule.pickupDate, reservation.schedule.dropoffDate);
            const total = days * vehicle.dailyRentalPrice;
            const isPast = reservation.schedule.dropoffDate < today;
            const isActive = reservation.schedule.pickupDate <= today && reservation.schedule.dropoffDate >= today;

            return (
              <div key={reservation.id} className="rounded-2xl border border-slate-700/50 bg-slate-800/40 overflow-hidden hover:border-slate-600/60 transition-colors">
                <div className="p-5 flex flex-col sm:flex-row gap-4">
                  {/* Vehicle Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {vehicle.imageUrl && (
                      <img src={vehicle.imageUrl} alt={vehicle.make} className="w-20 h-14 rounded-xl object-cover flex-shrink-0" onError={e => e.currentTarget.style.display='none'} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-white">{vehicle.make} {vehicle.model}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg border font-semibold ${
                          isActive ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                          isPast ? 'text-slate-400 bg-slate-700/50 border-slate-600/50' :
                          'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                        }`}>
                          {isActive ? '● Active' : isPast ? 'Completed' : '● Upcoming'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400 mb-2">{vehicle.registrationNumber}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-300 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {formatDate(reservation.schedule.pickupDate)} → {formatDate(reservation.schedule.dropoffDate)}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="font-semibold text-white">{days} days · {formatCurrency(total)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Driver: {reservation.driver.name} {reservation.driver.surname} · {reservation.driver.licenseNumber}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isPast && (
                    <div className="flex sm:flex-col gap-2 items-center sm:items-end justify-end">
                      <Button variant="outline" size="sm" onClick={() => openEdit({ vehicle, reservation })}>
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Modify
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => openDelete({ vehicle, reservation })}>
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={o => { if (!o) { setEditOpen(false); setError(''); setSuccessMsg(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modify Reservation</DialogTitle>
            <DialogDescription>
              {selected && `${selected.vehicle.make} ${selected.vehicle.model} · ${selected.vehicle.registrationNumber}`}
            </DialogDescription>
          </DialogHeader>

          {successMsg ? (
            <div className="flex flex-col items-center py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
              <p className="text-white font-semibold">{successMsg}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>New Pickup Date</Label>
                  <Input type="date" min={today} value={newPickup} onChange={e => setNewPickup(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>New Dropoff Date</Label>
                  <Input type="date" min={newPickup || today} value={newDropoff} onChange={e => setNewDropoff(e.target.value)} />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleEdit}>Update Reservation</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Reservation?</DialogTitle>
            <DialogDescription>
              {selected && `${selected.vehicle.make} ${selected.vehicle.model} · ${formatDate(selected.reservation.schedule.pickupDate)} – ${formatDate(selected.reservation.schedule.dropoffDate)}`}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-slate-400 mb-4">This action cannot be undone.</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)}>Keep Booking</Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>Cancel Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </RequireAuth>
  );
}
