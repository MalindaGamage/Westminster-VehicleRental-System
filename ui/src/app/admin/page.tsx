'use client';
import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { RequireAuth } from '@/components/auth/require-auth';
import { AddVehicleDialog } from '@/components/admin/add-vehicle-dialog';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MAX_PARKING_SLOTS } from '@/lib/data';
import {
  Plus, Trash2, BarChart3, Car, Zap, Truck, Bike, Calendar,
  Download, Search, ShieldAlert, CheckCircle2, TrendingUp,
  Activity
} from 'lucide-react';

export default function AdminPage() {
  const { state, dispatch } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'make' | 'price' | 'type'>('make');
  const [tab, setTab] = useState<'fleet' | 'analytics'>('fleet');

  const stats = useMemo(() => {
    const total = state.vehicles.length;
    const available = state.vehicles.filter(v =>
      !v.reservations.some(r => r.schedule.dropoffDate >= new Date().toISOString().split('T')[0])
    ).length;
    const totalReservations = state.vehicles.reduce((acc, v) => acc + v.reservations.length, 0);
    const avgPrice = total > 0 ? state.vehicles.reduce((acc, v) => acc + v.dailyRentalPrice, 0) / total : 0;
    const byType = {
      Car: state.vehicles.filter(v => v.vehicleType === 'Car').length,
      ElectricCar: state.vehicles.filter(v => v.vehicleType === 'ElectricCar').length,
      Van: state.vehicles.filter(v => v.vehicleType === 'Van').length,
      Motorbike: state.vehicles.filter(v => v.vehicleType === 'Motorbike').length,
    };
    return { total, available, totalReservations, avgPrice, byType };
  }, [state.vehicles]);

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
    list.sort((a, b) => {
      if (sortBy === 'price') return a.dailyRentalPrice - b.dailyRentalPrice;
      if (sortBy === 'type') return a.vehicleType.localeCompare(b.vehicleType);
      return a.make.localeCompare(b.make);
    });
    return list;
  }, [state.vehicles, search, sortBy]);

  function handleDelete(reg: string) { setDeleteId(reg); }

  function confirmDelete() {
    if (deleteId) { dispatch({ type: 'DELETE_VEHICLE', registrationNumber: deleteId }); }
    setDeleteId(null);
  }

  function generateReport(): string {
    const lines: string[] = [
      '═══════════════════════════════════════════',
      '       WESTMINSTER VEHICLE RENTAL REPORT    ',
      '═══════════════════════════════════════════',
      `Generated: ${new Date().toLocaleString()}`,
      `Total Vehicles: ${stats.total} / ${MAX_PARKING_SLOTS}`,
      `Available: ${stats.available}  |  Total Reservations: ${stats.totalReservations}`,
      '',
      '─── FLEET BY TYPE ───────────────────────',
      `  Cars:        ${stats.byType.Car}`,
      `  Electric:    ${stats.byType.ElectricCar}`,
      `  Vans:        ${stats.byType.Van}`,
      `  Motorbikes:  ${stats.byType.Motorbike}`,
      '',
      '─── VEHICLE DETAILS ─────────────────────',
    ];

    [...state.vehicles]
      .sort((a, b) => a.make.localeCompare(b.make))
      .forEach(v => {
        lines.push(`\n  ${v.make} ${v.model} [${v.registrationNumber}]`);
        lines.push(`  Type: ${v.vehicleType}  |  Price: ${formatCurrency(v.dailyRentalPrice)}/day`);
        if (v.reservations.length === 0) {
          lines.push('  Reservations: None');
        } else {
          v.reservations.forEach(r => {
            lines.push(`  ● ${r.driver.name} ${r.driver.surname} · ${r.schedule.pickupDate} → ${r.schedule.dropoffDate}`);
          });
        }
      });

    lines.push('\n═══════════════════════════════════════════');
    return lines.join('\n');
  }

  function downloadReport() {
    const content = generateReport();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `westminster-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const slots = MAX_PARKING_SLOTS - state.vehicles.length;
  const usagePct = Math.round((state.vehicles.length / MAX_PARKING_SLOTS) * 100);

  return (
    <RequireAuth role="admin">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase">Admin Portal</p>
          </div>
          <h1 className="text-4xl font-black text-white mb-1">Fleet Management</h1>
          <p className="text-slate-400">Manage vehicles, view analytics, and generate reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setReportOpen(true)} className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> View Report
          </Button>
          <Button onClick={downloadReport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Download
          </Button>
          <Button onClick={() => setAddOpen(true)} disabled={state.vehicles.length >= MAX_PARKING_SLOTS} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Vehicles', value: `${stats.total}/${MAX_PARKING_SLOTS}`, icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
          { label: 'Available Now', value: stats.available, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
          { label: 'Total Bookings', value: stats.totalReservations, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
          { label: 'Avg Daily Rate', value: formatCurrency(stats.avgPrice), icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border ${s.bg} p-5`}>
            <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Parking Capacity Bar */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Parking Capacity</p>
          <p className="text-sm text-slate-400">{state.vehicles.length} / {MAX_PARKING_SLOTS} slots used · <span className={slots > 0 ? 'text-emerald-400' : 'text-red-400'}>{slots} free</span></p>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${usagePct > 80 ? 'bg-red-500' : usagePct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500">
          <span>{usagePct}% full</span>
          <span>{MAX_PARKING_SLOTS - state.vehicles.length} available</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([['fleet', 'Fleet Management'] as const, ['analytics', 'Analytics'] as const]).map(([id, label]) => {
          const Icon = id === 'fleet' ? Activity : BarChart3;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                tab === id ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'fleet' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input placeholder="Search fleet..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="make">Sort: Make</SelectItem>
                <SelectItem value="price">Sort: Price</SelectItem>
                <SelectItem value="type">Sort: Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-12 text-center">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">No vehicles match your search</p>
              <Button variant="ghost" size="sm" onClick={() => setSearch('')}>Clear search</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(v => (
                <VehicleCard key={v.registrationNumber} vehicle={v} showActions onDelete={handleDelete} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Type */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
            <h3 className="font-bold text-white mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" /> Fleet Composition
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Cars', count: stats.byType.Car, icon: Car, color: 'bg-blue-500' },
                { label: 'Electric Cars', count: stats.byType.ElectricCar, icon: Zap, color: 'bg-emerald-500' },
                { label: 'Vans', count: stats.byType.Van, icon: Truck, color: 'bg-amber-500' },
                { label: 'Motorbikes', count: stats.byType.Motorbike, icon: Bike, color: 'bg-purple-500' },
              ].map(({ label, count, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-white font-semibold">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
            <h3 className="font-bold text-white mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" /> Recent Reservations
            </h3>
            {stats.totalReservations === 0 ? (
              <p className="text-slate-500 text-sm">No reservations yet</p>
            ) : (
              <div className="space-y-3">
                {state.vehicles
                  .flatMap(v => v.reservations.map(r => ({ vehicle: v, reservation: r })))
                  .sort((a, b) => b.reservation.createdAt.localeCompare(a.reservation.createdAt))
                  .slice(0, 6)
                  .map(({ vehicle, reservation }) => (
                    <div key={reservation.id} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{vehicle.make} {vehicle.model}</p>
                        <p className="text-slate-400 text-xs">{reservation.driver.name} {reservation.driver.surname} · {formatDate(reservation.schedule.pickupDate)}</p>
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0">{formatDate(reservation.createdAt)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Price Distribution */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 lg:col-span-2">
            <h3 className="font-bold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" /> Price Distribution
            </h3>
            <div className="flex items-end gap-2 h-24">
              {[...state.vehicles]
                .sort((a, b) => a.dailyRentalPrice - b.dailyRentalPrice)
                .map(v => {
                  const maxP = Math.max(...state.vehicles.map(x => x.dailyRentalPrice));
                  const pct = (v.dailyRentalPrice / maxP) * 100;
                  return (
                    <div key={v.registrationNumber} className="flex flex-col items-center gap-1 flex-1 group">
                      <div
                        className="w-full rounded-t-md bg-blue-600/60 group-hover:bg-blue-500 transition-colors"
                        style={{ height: `${pct}%` }}
                        title={`${v.make} ${v.model}: ${formatCurrency(v.dailyRentalPrice)}/day`}
                      />
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Min: {formatCurrency(Math.min(...state.vehicles.map(v => v.dailyRentalPrice)))}/day</span>
              <span>Avg: {formatCurrency(stats.avgPrice)}/day</span>
              <span>Max: {formatCurrency(Math.max(...state.vehicles.map(v => v.dailyRentalPrice)))}/day</span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddVehicleDialog open={addOpen} onClose={() => setAddOpen(false)} />

      <Dialog open={!!deleteId} onOpenChange={o => { if (!o) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Vehicle?</DialogTitle>
            <DialogDescription>
              {deleteId && (() => {
                const v = state.vehicles.find(v => v.registrationNumber === deleteId);
                return v ? `${v.make} ${v.model} [${v.registrationNumber}]` : deleteId;
              })()}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-slate-400 mb-4">This will permanently remove the vehicle and all its reservations.</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4 mr-1.5" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fleet Report</DialogTitle>
            <DialogDescription>Generated: {new Date().toLocaleString()}</DialogDescription>
          </DialogHeader>
          <pre className="text-xs text-slate-300 bg-slate-950 rounded-xl p-4 overflow-auto max-h-96 font-mono leading-relaxed">
            {generateReport()}
          </pre>
          <Button onClick={downloadReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Report
          </Button>
        </DialogContent>
      </Dialog>
    </div>
    </RequireAuth>
  );
}
