'use client';
import { useState } from 'react';
import { Vehicle, VehicleType } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { MAX_PARKING_SLOTS } from '@/lib/data';

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddVehicleDialog({ open, onClose }: AddVehicleDialogProps) {
  const { state, dispatch } = useStore();
  const [type, setType] = useState<VehicleType>('Car');
  const [reg, setReg] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [seats, setSeats] = useState('5');
  const [battery, setBattery] = useState('');
  const [range, setRange] = useState('');
  const [cargo, setCargo] = useState('');
  const [passengerVan, setPassengerVan] = useState(false);
  const [engineSize, setEngineSize] = useState('');
  const [sidecar, setSidecar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function reset() {
    setType('Car'); setReg(''); setMake(''); setModel(''); setPrice('');
    setBodyStyle(''); setSeats('5'); setBattery(''); setRange('');
    setCargo(''); setPassengerVan(false); setEngineSize(''); setSidecar(false);
    setError(''); setSuccess(false);
  }

  function handleClose() { reset(); onClose(); }

  function handleSubmit() {
    setError('');
    if (!reg.trim() || !make.trim() || !model.trim() || !price) {
      setError('Please fill all required fields.'); return;
    }
    if (state.vehicles.length >= MAX_PARKING_SLOTS) {
      setError(`Parking is full (max ${MAX_PARKING_SLOTS} vehicles).`); return;
    }
    if (state.vehicles.find(v => v.registrationNumber === reg.toUpperCase())) {
      setError('Registration number already exists.'); return;
    }

    const base = {
      registrationNumber: reg.toUpperCase().trim(),
      make: make.trim(),
      model: model.trim(),
      dailyRentalPrice: parseFloat(price),
      reservations: [],
    };

    let vehicle: Vehicle;
    if (type === 'Car') vehicle = { ...base, vehicleType: 'Car', bodyStyle: bodyStyle || 'Saloon', numberOfSeats: parseInt(seats) || 5 };
    else if (type === 'ElectricCar') vehicle = { ...base, vehicleType: 'ElectricCar', batteryCapacity: parseFloat(battery) || 0, rangePerCharge: parseFloat(range) || 0 };
    else if (type === 'Van') vehicle = { ...base, vehicleType: 'Van', cargoSpace: parseFloat(cargo) || 0, isPassengerVan: passengerVan };
    else vehicle = { ...base, vehicleType: 'Motorbike', engineSize: parseInt(engineSize) || 0, hasSideCar: sidecar };

    dispatch({ type: 'ADD_VEHICLE', vehicle });
    setSuccess(true);
    setTimeout(handleClose, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) handleClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>Add a vehicle to the fleet ({state.vehicles.length}/{MAX_PARKING_SLOTS} slots used)</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-white font-semibold">Vehicle Added!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Vehicle Type</Label>
              <Select value={type} onValueChange={v => setType(v as VehicleType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="ElectricCar">Electric Car</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Motorbike">Motorbike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Registration Number *</Label>
                <Input placeholder="AB21XYZ" value={reg} onChange={e => setReg(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Daily Price (LKR) *</Label>
                <Input type="number" placeholder="89" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Make *</Label>
                <Input placeholder="BMW" value={make} onChange={e => setMake(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Model *</Label>
                <Input placeholder="3 Series" value={model} onChange={e => setModel(e.target.value)} />
              </div>
            </div>

            {type === 'Car' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Body Style</Label>
                  <Input placeholder="Saloon" value={bodyStyle} onChange={e => setBodyStyle(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Seats</Label>
                  <Input type="number" value={seats} onChange={e => setSeats(e.target.value)} />
                </div>
              </div>
            )}
            {type === 'ElectricCar' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Battery (kWh)</Label>
                  <Input type="number" placeholder="82" value={battery} onChange={e => setBattery(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Range (km)</Label>
                  <Input type="number" placeholder="560" value={range} onChange={e => setRange(e.target.value)} />
                </div>
              </div>
            )}
            {type === 'Van' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Cargo Space (m³)</Label>
                  <Input type="number" placeholder="11.5" value={cargo} onChange={e => setCargo(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="passengerVan" checked={passengerVan} onChange={e => setPassengerVan(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <label htmlFor="passengerVan" className="text-sm text-slate-300">Passenger Van</label>
                </div>
              </div>
            )}
            {type === 'Motorbike' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Engine Size (cc)</Label>
                  <Input type="number" placeholder="649" value={engineSize} onChange={e => setEngineSize(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="sidecar" checked={sidecar} onChange={e => setSidecar(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <label htmlFor="sidecar" className="text-sm text-slate-300">Has Sidecar</label>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
              <Button className="flex-1" onClick={handleSubmit}>Add Vehicle</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
