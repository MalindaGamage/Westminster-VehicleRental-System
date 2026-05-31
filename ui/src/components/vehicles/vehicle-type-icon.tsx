import { Car, Zap, Truck, Bike } from 'lucide-react';
import { VehicleType } from '@/lib/types';

export function VehicleTypeIcon({ type, className }: { type: VehicleType; className?: string }) {
  const icons: Record<VehicleType, React.ReactNode> = {
    Car: <Car className={className} />,
    ElectricCar: <Zap className={className} />,
    Van: <Truck className={className} />,
    Motorbike: <Bike className={className} />,
  };
  return <>{icons[type]}</>;
}

export const vehicleTypeColors: Record<VehicleType, string> = {
  Car: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  ElectricCar: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Van: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Motorbike: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

export const vehicleTypeLabels: Record<VehicleType, string> = {
  Car: 'Car',
  ElectricCar: 'Electric Car',
  Van: 'Van',
  Motorbike: 'Motorbike',
};
