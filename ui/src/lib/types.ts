export type VehicleType = 'Car' | 'ElectricCar' | 'Van' | 'Motorbike';

export interface Schedule {
  pickupDate: string;
  dropoffDate: string;
}

export interface Driver {
  name: string;
  surname: string;
  dateOfBirth: string;
  licenseNumber: string;
}

export interface Reservation {
  id: string;
  vehicleRegistration: string;
  driver: Driver;
  schedule: Schedule;
  createdAt: string;
}

export interface BaseVehicle {
  registrationNumber: string;
  make: string;
  model: string;
  dailyRentalPrice: number;
  vehicleType: VehicleType;
  reservations: Reservation[];
  imageUrl?: string;
}

export interface Car extends BaseVehicle {
  vehicleType: 'Car';
  bodyStyle: string;
  numberOfSeats: number;
}

export interface ElectricCar extends BaseVehicle {
  vehicleType: 'ElectricCar';
  batteryCapacity: number;
  rangePerCharge: number;
}

export interface Van extends BaseVehicle {
  vehicleType: 'Van';
  cargoSpace: number;
  isPassengerVan: boolean;
}

export interface Motorbike extends BaseVehicle {
  vehicleType: 'Motorbike';
  engineSize: number;
  hasSideCar: boolean;
}

export type Vehicle = Car | ElectricCar | Van | Motorbike;

export interface SearchFilters {
  vehicleType?: VehicleType | 'All';
  pickupDate?: string;
  dropoffDate?: string;
  maxPrice?: number;
}
