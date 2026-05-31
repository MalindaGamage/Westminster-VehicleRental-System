'use client';
import Link from 'next/link';
import { Car as CarType, ElectricCar, Van, Motorbike, Vehicle } from '@/lib/types';
import { formatCurrency, isVehicleAvailable } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VehicleTypeIcon, vehicleTypeColors, vehicleTypeLabels } from './vehicle-type-icon';
import { Calendar, Star, Users, Battery, Package, Gauge } from 'lucide-react';
import { useState } from 'react';

interface VehicleCardProps {
  vehicle: Vehicle;
  schedule?: { pickupDate: string; dropoffDate: string };
  onBook?: (vehicle: Vehicle) => void;
  showActions?: boolean;
  onDelete?: (reg: string) => void;
}

function VehicleSpecs({ vehicle }: { vehicle: Vehicle }) {
  if (vehicle.vehicleType === 'Car') {
    const v = vehicle as CarType;
    return (
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {v.numberOfSeats} seats</span>
        <span className="capitalize">{v.bodyStyle}</span>
      </div>
    );
  }
  if (vehicle.vehicleType === 'ElectricCar') {
    const v = vehicle as ElectricCar;
    return (
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><Battery className="w-3.5 h-3.5" /> {v.batteryCapacity} kWh</span>
        <span>{v.rangePerCharge} km range</span>
      </div>
    );
  }
  if (vehicle.vehicleType === 'Van') {
    const v = vehicle as Van;
    return (
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {v.cargoSpace} m³</span>
        <span>{v.isPassengerVan ? 'Passenger Van' : 'Cargo Van'}</span>
      </div>
    );
  }
  if (vehicle.vehicleType === 'Motorbike') {
    const v = vehicle as Motorbike;
    return (
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> {v.engineSize} cc</span>
        {v.hasSideCar && <span>With Sidecar</span>}
      </div>
    );
  }
  return null;
}

export function VehicleCard({ vehicle, schedule, onBook, showActions = true, onDelete }: VehicleCardProps) {
  const [imgError, setImgError] = useState(false);
  const available = schedule ? isVehicleAvailable(vehicle, schedule) : vehicle.reservations.length === 0;
  const colorClass = vehicleTypeColors[vehicle.vehicleType];

  return (
    <div className="group relative rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm overflow-hidden hover:border-slate-600/60 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5">
      <div className="relative h-44 overflow-hidden bg-slate-700/30">
        {vehicle.imageUrl && !imgError ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <VehicleTypeIcon type={vehicle.vehicleType} className="w-16 h-16 text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold border ${colorClass}`}>
            <VehicleTypeIcon type={vehicle.vehicleType} className="w-3 h-3" />
            {vehicleTypeLabels[vehicle.vehicleType]}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold border ${
            available ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {available ? '● Available' : '● Booked'}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 bg-black/40 rounded-lg px-2 py-0.5">{vehicle.registrationNumber}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">{vehicle.make} {vehicle.model}</h3>
            <VehicleSpecs vehicle={vehicle} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{formatCurrency(vehicle.dailyRentalPrice)}</p>
            <p className="text-xs text-slate-500">per day</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500">
            {vehicle.reservations.length === 0
              ? 'No active bookings'
              : `${vehicle.reservations.length} booking${vehicle.reservations.length > 1 ? 's' : ''}`}
          </span>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/vehicles/${vehicle.registrationNumber}`}>Details</Link>
            </Button>
            {onBook && available && (
              <Button size="sm" className="flex-1" onClick={() => onBook(vehicle)}>
                Book Now
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(vehicle.registrationNumber)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
