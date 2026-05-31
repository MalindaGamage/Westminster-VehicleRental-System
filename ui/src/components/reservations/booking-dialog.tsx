'use client';
import { useState } from 'react';
import { Vehicle, Driver } from '@/lib/types';
import { useStore } from '@/lib/store';
import { daysBetween, formatCurrency, isVehicleAvailable } from '@/lib/utils';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, User, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
}

type Step = 'dates' | 'driver' | 'confirm' | 'success';

export function BookingDialog({ vehicle, open, onClose }: BookingDialogProps) {
  const { dispatch } = useStore();
  const [step, setStep] = useState<Step>('dates');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [driver, setDriver] = useState<Driver>({
    name: '',
    surname: '',
    dateOfBirth: '',
    licenseNumber: '',
  });
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const days = pickupDate && dropoffDate ? daysBetween(pickupDate, dropoffDate) : 0;
  const total = vehicle ? days * vehicle.dailyRentalPrice : 0;

  const schedule = { pickupDate, dropoffDate };
  const available = vehicle && pickupDate && dropoffDate ? isVehicleAvailable(vehicle, schedule) : true;

  function handleClose() {
    setStep('dates');
    setPickupDate('');
    setDropoffDate('');
    setDriver({ name: '', surname: '', dateOfBirth: '', licenseNumber: '' });
    setError('');
    onClose();
  }

  function nextStep() {
    setError('');
    if (step === 'dates') {
      if (!pickupDate || !dropoffDate) { setError('Please select both dates.'); return; }
      if (pickupDate >= dropoffDate) { setError('Dropoff must be after pickup.'); return; }
      if (!available) { setError('Vehicle is not available for these dates.'); return; }
      setStep('driver');
    } else if (step === 'driver') {
      if (!driver.name || !driver.surname || !driver.dateOfBirth || !driver.licenseNumber) {
        setError('Please fill all driver details.'); return;
      }
      setStep('confirm');
    } else if (step === 'confirm') {
      if (!vehicle) return;
      dispatch({ type: 'ADD_RESERVATION', registrationNumber: vehicle.registrationNumber, schedule, driver });
      setStep('success');
    }
  }

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'success' ? 'Booking Confirmed!' : `Book ${vehicle.make} ${vehicle.model}`}
          </DialogTitle>
          <DialogDescription>
            {step === 'dates' && 'Select your rental period'}
            {step === 'driver' && 'Enter driver details'}
            {step === 'confirm' && 'Review and confirm your booking'}
            {step === 'success' && `Your booking for ${vehicle.make} ${vehicle.model} is confirmed`}
          </DialogDescription>
        </DialogHeader>

        {step !== 'success' && (
          <div className="flex gap-1 mb-6">
            {(['dates', 'driver', 'confirm'] as Step[]).map((s, i) => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all ${
                ['dates', 'driver', 'confirm'].indexOf(step) >= i ? 'bg-blue-500' : 'bg-slate-700'
              }`} />
            ))}
          </div>
        )}

        {step === 'dates' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <img src={vehicle.imageUrl} className="w-16 h-12 rounded-lg object-cover" onError={e => e.currentTarget.style.display='none'} />
                <div>
                  <p className="font-semibold text-white">{vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-slate-400">{formatCurrency(vehicle.dailyRentalPrice)}/day</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Pickup Date</Label>
                <Input type="date" value={pickupDate} min={today} onChange={e => setPickupDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Dropoff Date</Label>
                <Input type="date" value={dropoffDate} min={pickupDate || today} onChange={e => setDropoffDate(e.target.value)} />
              </div>
            </div>
            {days > 0 && (
              <div className="rounded-xl bg-blue-600/10 border border-blue-600/20 p-3 flex justify-between">
                <span className="text-slate-300 text-sm">{days} days × {formatCurrency(vehicle.dailyRentalPrice)}</span>
                <span className="font-bold text-white">{formatCurrency(total)}</span>
              </div>
            )}
          </div>
        )}

        {step === 'driver' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>First Name</Label>
                <Input placeholder="John" value={driver.name} onChange={e => setDriver(d => ({ ...d, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Surname</Label>
                <Input placeholder="Smith" value={driver.surname} onChange={e => setDriver(d => ({ ...d, surname: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <Input type="date" value={driver.dateOfBirth} onChange={e => setDriver(d => ({ ...d, dateOfBirth: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Licence Number</Label>
              <Input placeholder="AB123456789" value={driver.licenseNumber} onChange={e => setDriver(d => ({ ...d, licenseNumber: e.target.value }))} />
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 divide-y divide-slate-700">
              <div className="p-3 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Rental Period</p>
                  <p className="text-sm text-white font-medium">{pickupDate} → {dropoffDate} ({days} days)</p>
                </div>
              </div>
              <div className="p-3 flex items-center gap-3">
                <User className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Driver</p>
                  <p className="text-sm text-white font-medium">{driver.name} {driver.surname}</p>
                  <p className="text-xs text-slate-400">{driver.licenseNumber}</p>
                </div>
              </div>
              <div className="p-3 flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Total Cost</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(total)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-slate-300 text-sm mb-2">
              <span className="font-semibold text-white">{driver.name} {driver.surname}</span> · {days} days
            </p>
            <p className="text-2xl font-bold text-white mb-4">{formatCurrency(total)}</p>
            <p className="text-xs text-slate-500">Booking reference: {vehicle.registrationNumber}-{pickupDate}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          {step !== 'success' && step !== 'dates' && (
            <Button variant="outline" className="flex-1" onClick={() => { setError(''); setStep(step === 'confirm' ? 'driver' : 'dates'); }}>
              Back
            </Button>
          )}
          {step === 'success' ? (
            <Button className="flex-1" onClick={handleClose}>Close</Button>
          ) : (
            <Button className="flex-1" onClick={nextStep}>
              {step === 'confirm' ? 'Confirm Booking' : 'Continue'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
