using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using WestminsterVehicleRentalSystem.Interfaces;
using WestminsterVehicleRentalSystem.Models;

namespace WestminsterVehicleRentalSystem.Services
{
    public class WestminsterRentalVehicle : IRentalManager, IRentalCustomer
    {
        private readonly List<Vehicle> _vehicles;
        private readonly string _filePath;
        private const int MaxParkingSlots = 50;

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        public WestminsterRentalVehicle(string filePath)
        {
            _filePath = filePath;
            _vehicles = LoadVehiclesFromFile(filePath);
        }

        // ── Read ─────────────────────────────────────────────────────────

        public IReadOnlyList<Vehicle> GetVehicles() => _vehicles.AsReadOnly();

        public IReadOnlyList<Vehicle> GetAvailableVehicles(Schedule schedule, string? vehicleType)
        {
            return _vehicles
                .Where(v =>
                    (vehicleType == null || GetVehicleTypeName(v) == vehicleType) &&
                    v.Reservations.All(r => !r.Schedule.Overlaps(schedule)))
                .ToList()
                .AsReadOnly();
        }

        public bool VehicleExists(string reg) =>
            _vehicles.Any(v => string.Equals(v.RegistrationNumber, reg, StringComparison.OrdinalIgnoreCase));

        // ── Vehicle CRUD ─────────────────────────────────────────────────

        public bool AddVehicle(Vehicle v)
        {
            if (_vehicles.Count >= MaxParkingSlots) return false;
            if (_vehicles.Any(x => x.RegistrationNumber == v.RegistrationNumber)) return false;
            _vehicles.Add(v);
            Save();
            return true;
        }

        public bool DeleteVehicle(string reg)
        {
            var vehicle = _vehicles.FirstOrDefault(v => v.RegistrationNumber == reg);
            if (vehicle == null) return false;
            _vehicles.Remove(vehicle);
            Save();
            return true;
        }

        // ── Reservation CRUD ─────────────────────────────────────────────

        public Reservation? AddReservation(string reg, Schedule schedule, Driver driver)
        {
            var vehicle = _vehicles.FirstOrDefault(v => v.RegistrationNumber == reg);
            if (vehicle == null) return null;

            if (vehicle.Reservations.Any(r => r.Schedule.Overlaps(schedule)))
                return null;

            var reservation = new Reservation
            {
                Driver = driver,
                Schedule = schedule,
            };
            vehicle.Reservations.Add(reservation);
            Save();
            return reservation;
        }

        public bool ChangeReservationById(string reg, string reservationId, Schedule newSchedule)
        {
            var vehicle = _vehicles.FirstOrDefault(v => v.RegistrationNumber == reg);
            if (vehicle == null) return false;

            var reservation = vehicle.Reservations.FirstOrDefault(r => r.Id == reservationId);
            if (reservation == null) return false;

            bool otherOverlaps = vehicle.Reservations
                .Where(r => r.Id != reservationId)
                .Any(r => r.Schedule.Overlaps(newSchedule));
            if (otherOverlaps) return false;

            reservation.Schedule = newSchedule;
            Save();
            return true;
        }

        public bool DeleteReservationById(string reg, string reservationId)
        {
            var vehicle = _vehicles.FirstOrDefault(v => v.RegistrationNumber == reg);
            if (vehicle == null) return false;

            var reservation = vehicle.Reservations.FirstOrDefault(r => r.Id == reservationId);
            if (reservation == null) return false;

            vehicle.Reservations.Remove(reservation);
            Save();
            return true;
        }

        // ── Report ───────────────────────────────────────────────────────

        public string GenerateReportText()
        {
            var sb = new StringBuilder();
            sb.AppendLine("Westminster Vehicle Rental — Fleet Report");
            sb.AppendLine(new string('─', 50));
            foreach (var v in _vehicles.OrderBy(v => v.Make))
            {
                sb.AppendLine($"{v.Make} {v.Model} [{v.RegistrationNumber}] — £{v.DailyRentalPrice}/day");
                foreach (var r in v.Reservations.OrderBy(r => r.Schedule.PickupDate))
                    sb.AppendLine($"  • {r.Schedule.PickupDate:yyyy-MM-dd} → {r.Schedule.DropoffDate:yyyy-MM-dd}  {r.Driver.Name} {r.Driver.Surname}");
            }
            return sb.ToString();
        }

        // ── IRentalManager (console compat) ─────────────────────────────

        public void ListVehicles() => _vehicles.ForEach(v => v.DisplayInfo());
        public void ListOrderedVehicles() => _vehicles.OrderBy(v => v.Make).ToList().ForEach(v => v.DisplayInfo());
        public void GenerateReport(string fileName) => File.WriteAllText(fileName, GenerateReportText());

        // ── IRentalCustomer (console compat, kept for interface) ─────────

        public void ListAvailableVehicles(Schedule schedule, Type type)
        {
            _vehicles
                .Where(v => v.GetType() == type && v.Reservations.All(r => !r.Schedule.Overlaps(schedule)))
                .ToList()
                .ForEach(v => v.DisplayInfo());
        }

        public bool AddReservation(string number, Schedule schedule)
        {
            var driver = new Driver("Guest", "User", DateTime.UtcNow.AddYears(-25), "GUEST0000");
            return AddReservation(number, schedule, driver) != null;
        }

        public bool ChangeReservation(string number, Schedule oldSchedule, Schedule newSchedule)
        {
            var vehicle = _vehicles.FirstOrDefault(v => v.RegistrationNumber == number);
            var res = vehicle?.Reservations.FirstOrDefault(r =>
                r.Schedule.PickupDate == oldSchedule.PickupDate &&
                r.Schedule.DropoffDate == oldSchedule.DropoffDate);
            return res != null && ChangeReservationById(number, res.Id, newSchedule);
        }

        public bool DeleteReservation(string number, Schedule schedule)
        {
            var vehicle = _vehicles.FirstOrDefault(v => v.RegistrationNumber == number);
            var res = vehicle?.Reservations.FirstOrDefault(r =>
                r.Schedule.PickupDate == schedule.PickupDate &&
                r.Schedule.DropoffDate == schedule.DropoffDate);
            return res != null && DeleteReservationById(number, res.Id);
        }

        // ── Persistence ──────────────────────────────────────────────────

        private void Save()
        {
            try
            {
                File.WriteAllText(_filePath, JsonSerializer.Serialize(_vehicles, _jsonOptions));
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Failed to save: {ex.Message}");
            }
        }

        private List<Vehicle> LoadVehiclesFromFile(string path)
        {
            if (!File.Exists(path)) return new List<Vehicle>();
            try
            {
                var json = File.ReadAllText(path);
                return JsonSerializer.Deserialize<List<Vehicle>>(json, _jsonOptions) ?? new List<Vehicle>();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Failed to load: {ex.Message}");
                return new List<Vehicle>();
            }
        }

        private static string GetVehicleTypeName(Vehicle v) => v switch
        {
            Car => "Car",
            ElectricCar => "ElectricCar",
            Van => "Van",
            Motorbike => "Motorbike",
            _ => "Unknown"
        };
    }
}
