'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { BookingDialog } from '@/components/reservations/booking-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle, VehicleType, SearchFilters } from '@/lib/types';
import { isVehicleAvailable } from '@/lib/utils';
import { Search, Filter, SlidersHorizontal, Car, Zap, Truck, Bike, X } from 'lucide-react';

const TYPE_OPTIONS = [
  { value: 'All', label: 'All Types', icon: Filter },
  { value: 'Car', label: 'Cars', icon: Car },
  { value: 'ElectricCar', label: 'Electric', icon: Zap },
  { value: 'Van', label: 'Vans', icon: Truck },
  { value: 'Motorbike', label: 'Motorbikes', icon: Bike },
] as const;

function CustomerPortalContent() {
  const searchParams = useSearchParams();
  const { state } = useStore();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    vehicleType: (searchParams.get('type') as VehicleType) || 'All',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'make'>('make');

  const today = new Date().toISOString().split('T')[0];

  const filtered = useMemo(() => {
    let list = [...state.vehicles];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.registrationNumber.toLowerCase().includes(q)
      );
    }

    if (filters.vehicleType && filters.vehicleType !== 'All') {
      list = list.filter(v => v.vehicleType === filters.vehicleType);
    }

    if (filters.pickupDate && filters.dropoffDate) {
      list = list.filter(v =>
        isVehicleAvailable(v, { pickupDate: filters.pickupDate!, dropoffDate: filters.dropoffDate! })
      );
    }

    if (filters.maxPrice) {
      list = list.filter(v => v.dailyRentalPrice <= filters.maxPrice!);
    }

    list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.dailyRentalPrice - b.dailyRentalPrice;
      if (sortBy === 'price-desc') return b.dailyRentalPrice - a.dailyRentalPrice;
      return a.make.localeCompare(b.make);
    });

    return list;
  }, [state.vehicles, search, filters, sortBy]);

  function handleBook(vehicle: Vehicle) {
    setSelectedVehicle(vehicle);
    setBookingOpen(true);
  }

  function clearFilters() {
    setFilters({ vehicleType: 'All' });
    setSearch('');
    setSortBy('make');
  }

  const hasActiveFilters = search || filters.vehicleType !== 'All' || filters.pickupDate || filters.dropoffDate || filters.maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-1">Customer Portal</p>
        <h1 className="text-4xl font-black text-white mb-2">Browse Our Fleet</h1>
        <p className="text-slate-400">Find and book your perfect vehicle</p>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilters(f => ({ ...f, vehicleType: value as VehicleType | 'All' }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filters.vehicleType === value
                ? 'bg-blue-600/20 text-blue-400 border-blue-600/30'
                : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className="text-xs opacity-70">
              ({value === 'All' ? state.vehicles.length : state.vehicles.filter(v => v.vehicleType === value).length})
            </span>
          </button>
        ))}
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search make, model, or registration..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="make">Sort: Make</SelectItem>
            <SelectItem value="price-asc">Price: Low–High</SelectItem>
            <SelectItem value="price-desc">Price: High–Low</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-amber-400" />}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Pickup Date</Label>
              <Input
                type="date"
                min={today}
                value={filters.pickupDate || ''}
                onChange={e => setFilters(f => ({ ...f, pickupDate: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Dropoff Date</Label>
              <Input
                type="date"
                min={filters.pickupDate || today}
                value={filters.dropoffDate || ''}
                onChange={e => setFilters(f => ({ ...f, dropoffDate: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Price (LKR/day)</Label>
              <Input
                type="number"
                placeholder="Any price"
                value={filters.maxPrice || ''}
                onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value ? parseInt(e.target.value) : undefined }))}
              />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-400">
          Showing <span className="text-white font-semibold">{filtered.length}</span> vehicle{filtered.length !== 1 ? 's' : ''}
          {filters.pickupDate && filters.dropoffDate && <span className="text-emerald-400"> available</span>}
        </p>
      </div>

      {/* Vehicle Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-16 text-center">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">No vehicles found</p>
          <p className="text-slate-400 text-sm mb-4">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <VehicleCard
              key={v.registrationNumber}
              vehicle={v}
              schedule={filters.pickupDate && filters.dropoffDate ? { pickupDate: filters.pickupDate, dropoffDate: filters.dropoffDate } : undefined}
              onBook={handleBook}
              showActions
            />
          ))}
        </div>
      )}

      <BookingDialog
        vehicle={selectedVehicle}
        open={bookingOpen}
        onClose={() => { setBookingOpen(false); setSelectedVehicle(null); }}
      />
    </div>
  );
}

export default function CustomerPage() {
  return (
    <Suspense>
      <CustomerPortalContent />
    </Suspense>
  );
}
