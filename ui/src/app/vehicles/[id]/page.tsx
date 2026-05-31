'use client';
import { useState } from 'react';
import { use } from 'react';
import { useStore } from '@/lib/store';
import { BookingDialog } from '@/components/reservations/booking-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency, daysBetween } from '@/lib/utils';
import { VehicleTypeIcon, vehicleTypeColors, vehicleTypeLabels } from '@/components/vehicles/vehicle-type-icon';
import { Car as CarType, ElectricCar, Van, Motorbike } from '@/lib/types';
import {
  ArrowLeft, Calendar, Users, Battery, Package, Gauge,
  Star, CheckCircle, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state } = useStore();
  const [bookingOpen, setBookingOpen] = useState(false);

  const vehicleOrUndef = state.vehicles.find(v => v.registrationNumber === id);
  if (!vehicleOrUndef) return notFound();
  const vehicle = vehicleOrUndef;

  const isAvailable = vehicle.reservations.length === 0 ||
    !vehicle.reservations.some(r => r.schedule.dropoffDate >= new Date().toISOString().split('T')[0]);

  const colorClass = vehicleTypeColors[vehicle.vehicleType];

  function renderSpecs() {
    if (vehicle.vehicleType === 'Car') {
      const v = vehicle as CarType;
      return [
        { icon: Users, label: 'Seats', value: v.numberOfSeats.toString() },
        { icon: Star, label: 'Body Style', value: v.bodyStyle },
      ];
    }
    if (vehicle.vehicleType === 'ElectricCar') {
      const v = vehicle as ElectricCar;
      return [
        { icon: Battery, label: 'Battery', value: `${v.batteryCapacity} kWh` },
        { icon: Gauge, label: 'Range', value: `${v.rangePerCharge} km` },
      ];
    }
    if (vehicle.vehicleType === 'Van') {
      const v = vehicle as Van;
      return [
        { icon: Package, label: 'Cargo Space', value: `${v.cargoSpace} m³` },
        { icon: Star, label: 'Type', value: v.isPassengerVan ? 'Passenger Van' : 'Cargo Van' },
      ];
    }
    if (vehicle.vehicleType === 'Motorbike') {
      const v = vehicle as Motorbike;
      return [
        { icon: Gauge, label: 'Engine', value: `${v.engineSize} cc` },
        { icon: Star, label: 'Sidecar', value: v.hasSideCar ? 'Yes' : 'No' },
      ];
    }
    return [];
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/customer" className="flex items-center gap-1.5 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Fleet
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image + Quick Info */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/30 mb-4 aspect-video">
            {vehicle.imageUrl ? (
              <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <VehicleTypeIcon type={vehicle.vehicleType} className="w-24 h-24 text-slate-600" />
              </div>
            )}
          </div>

          {/* Reservations Timeline */}
          {vehicle.reservations.length > 0 && (
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Existing Bookings
              </h3>
              <div className="space-y-2">
                {vehicle.reservations.map(r => (
                  <div key={r.id} className="flex items-center justify-between text-sm rounded-xl bg-slate-700/30 px-3 py-2">
                    <span className="text-slate-300">{formatDate(r.schedule.pickupDate)} → {formatDate(r.schedule.dropoffDate)}</span>
                    <span className="text-slate-400">{daysBetween(r.schedule.pickupDate, r.schedule.dropoffDate)}d</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Details + Booking */}
        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-semibold ${colorClass}`}>
              <VehicleTypeIcon type={vehicle.vehicleType} className="w-3.5 h-3.5" />
              {vehicleTypeLabels[vehicle.vehicleType]}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-semibold ${
              isAvailable ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
            }`}>
              {isAvailable ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <h1 className="text-4xl font-black text-white mb-1">{vehicle.make} {vehicle.model}</h1>
          <p className="font-mono text-slate-400 mb-6">{vehicle.registrationNumber}</p>

          {/* Price Card */}
          <div className="rounded-2xl border border-blue-600/20 bg-blue-600/10 p-5 mb-6">
            <p className="text-sm text-blue-300 mb-1">Daily Rate</p>
            <p className="text-5xl font-black text-white">{formatCurrency(vehicle.dailyRentalPrice)}</p>
            <p className="text-sm text-slate-400 mt-1">per day · no hidden fees</p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {renderSpecs().map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <Icon className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-xs text-slate-400">{label}</p>
                <p className="font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <Button size="lg" className="w-full" onClick={() => setBookingOpen(true)} disabled={!isAvailable}>
            {isAvailable ? 'Book This Vehicle' : 'Unavailable'}
          </Button>
        </div>
      </div>

      <BookingDialog vehicle={vehicle} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
