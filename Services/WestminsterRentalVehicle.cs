using System.Text;
using Microsoft.EntityFrameworkCore;
using WestminsterVehicleRentalSystem.Data;
using WestminsterVehicleRentalSystem.Interfaces;
using WestminsterVehicleRentalSystem.Models;

namespace WestminsterVehicleRentalSystem.Services
{
    public class WestminsterRentalVehicle : IRentalManager, IRentalCustomer
    {
        private readonly IDbContextFactory<AppDbContext> _dbFactory;
        private const int MaxParkingSlots = 50;

        public WestminsterRentalVehicle(IDbContextFactory<AppDbContext> dbFactory)
        {
            _dbFactory = dbFactory;
        }

        // ── Read ─────────────────────────────────────────────────────────────

        public IReadOnlyList<Vehicle> GetVehicles()
        {
            using var db = _dbFactory.CreateDbContext();
            return db.Vehicles
                     .Include(v => v.Reservations)
                     .AsNoTracking()
                     .ToList()
                     .Select(MapToVehicle)
                     .ToList();
        }

        public IReadOnlyList<Vehicle> GetAvailableVehicles(Schedule schedule, string? vehicleType)
        {
            return GetVehicles()
                .Where(v =>
                    (vehicleType == null || GetTypeName(v) == vehicleType) &&
                    v.Reservations.All(r => !r.Schedule.Overlaps(schedule)))
                .ToList();
        }

        public bool VehicleExists(string reg)
        {
            using var db = _dbFactory.CreateDbContext();
            return db.Vehicles.Any(v => v.RegistrationNumber == reg);
        }

        // ── Vehicle CRUD ──────────────────────────────────────────────────────

        public bool AddVehicle(Vehicle v)
        {
            using var db = _dbFactory.CreateDbContext();
            if (db.Vehicles.Count() >= MaxParkingSlots) return false;
            if (db.Vehicles.Any(x => x.RegistrationNumber == v.RegistrationNumber)) return false;
            db.Vehicles.Add(MapToEntity(v));
            db.SaveChanges();
            return true;
        }

        public bool DeleteVehicle(string reg)
        {
            using var db = _dbFactory.CreateDbContext();
            var entity = db.Vehicles.Find(reg);
            if (entity == null) return false;
            db.Vehicles.Remove(entity);
            db.SaveChanges();
            return true;
        }

        // ── Reservation CRUD ──────────────────────────────────────────────────

        public Reservation? AddReservation(string reg, Schedule schedule, Driver driver)
        {
            using var db = _dbFactory.CreateDbContext();
            var vehicle = db.Vehicles.Include(v => v.Reservations).FirstOrDefault(v => v.RegistrationNumber == reg);
            if (vehicle == null) return null;

            bool overlaps = vehicle.Reservations.Any(r =>
                r.PickupDate < schedule.DropoffDate && r.DropoffDate > schedule.PickupDate);
            if (overlaps) return null;

            var entity = new ReservationEntity
            {
                Id = Guid.NewGuid().ToString()[..8],
                VehicleRegistration = reg,
                DriverName = driver.Name,
                DriverSurname = driver.Surname,
                DriverDateOfBirth = driver.DateOfBirth,
                DriverLicenseNumber = driver.LicenseNumber,
                PickupDate = schedule.PickupDate,
                DropoffDate = schedule.DropoffDate,
            };
            db.Reservations.Add(entity);
            db.SaveChanges();
            return MapToReservation(entity);
        }

        public bool ChangeReservationById(string reg, string reservationId, Schedule newSchedule)
        {
            using var db = _dbFactory.CreateDbContext();
            var res = db.Reservations.FirstOrDefault(r => r.Id == reservationId && r.VehicleRegistration == reg);
            if (res == null) return false;

            bool otherOverlaps = db.Reservations
                .Where(r => r.VehicleRegistration == reg && r.Id != reservationId)
                .Any(r => r.PickupDate < newSchedule.DropoffDate && r.DropoffDate > newSchedule.PickupDate);
            if (otherOverlaps) return false;

            res.PickupDate = newSchedule.PickupDate;
            res.DropoffDate = newSchedule.DropoffDate;
            db.SaveChanges();
            return true;
        }

        public bool DeleteReservationById(string reg, string reservationId)
        {
            using var db = _dbFactory.CreateDbContext();
            var res = db.Reservations.FirstOrDefault(r => r.Id == reservationId && r.VehicleRegistration == reg);
            if (res == null) return false;
            db.Reservations.Remove(res);
            db.SaveChanges();
            return true;
        }

        // ── Report ────────────────────────────────────────────────────────────

        public string GenerateReportText()
        {
            var sb = new StringBuilder();
            sb.AppendLine("Gamage Vehicle Rental — Fleet Report");
            sb.AppendLine(new string('─', 50));
            foreach (var v in GetVehicles().OrderBy(v => v.Make))
            {
                sb.AppendLine($"{v.Make} {v.Model} [{v.RegistrationNumber}] — LKR {v.DailyRentalPrice:N0}/day");
                foreach (var r in v.Reservations.OrderBy(r => r.Schedule.PickupDate))
                    sb.AppendLine($"  • {r.Schedule.PickupDate:yyyy-MM-dd} → {r.Schedule.DropoffDate:yyyy-MM-dd}  {r.Driver.Name} {r.Driver.Surname}");
            }
            return sb.ToString();
        }

        // ── IRentalManager / IRentalCustomer (console compat) ────────────────

        public void ListVehicles() => GetVehicles().ToList().ForEach(v => v.DisplayInfo());
        public void ListOrderedVehicles() => GetVehicles().OrderBy(v => v.Make).ToList().ForEach(v => v.DisplayInfo());
        public void GenerateReport(string fileName) => File.WriteAllText(fileName, GenerateReportText());

        public void ListAvailableVehicles(Schedule schedule, Type type) =>
            GetAvailableVehicles(schedule, type.Name)
                .ToList().ForEach(v => v.DisplayInfo());

        public bool AddReservation(string number, Schedule schedule)
        {
            var driver = new Driver("Guest", "User", DateTime.UtcNow.AddYears(-25), "GUEST0000");
            return AddReservation(number, schedule, driver) != null;
        }

        public bool ChangeReservation(string number, Schedule oldSchedule, Schedule newSchedule)
        {
            using var db = _dbFactory.CreateDbContext();
            var res = db.Reservations.FirstOrDefault(r =>
                r.VehicleRegistration == number &&
                r.PickupDate == oldSchedule.PickupDate &&
                r.DropoffDate == oldSchedule.DropoffDate);
            return res != null && ChangeReservationById(number, res.Id, newSchedule);
        }

        public bool DeleteReservation(string number, Schedule schedule)
        {
            using var db = _dbFactory.CreateDbContext();
            var res = db.Reservations.FirstOrDefault(r =>
                r.VehicleRegistration == number &&
                r.PickupDate == schedule.PickupDate &&
                r.DropoffDate == schedule.DropoffDate);
            return res != null && DeleteReservationById(number, res.Id);
        }

        // ── Mapping ───────────────────────────────────────────────────────────

        private static Vehicle MapToVehicle(VehicleEntity e)
        {
            Vehicle v = e.VehicleType switch
            {
                "Car"         => new Car(e.RegistrationNumber, e.Make, e.Model, e.DailyRentalPrice, e.BodyStyle ?? "Saloon", e.NumberOfSeats ?? 5),
                "ElectricCar" => new ElectricCar(e.RegistrationNumber, e.Make, e.Model, e.DailyRentalPrice, e.BatteryCapacity ?? 0, e.RangePerCharge ?? 0),
                "Van"         => new Van(e.RegistrationNumber, e.Make, e.Model, e.DailyRentalPrice, e.CargoSpace ?? 0, e.IsPassengerVan ?? false),
                "Motorbike"   => new Motorbike(e.RegistrationNumber, e.Make, e.Model, e.DailyRentalPrice, e.EngineSize ?? 0, e.HasSideCar ?? false),
                _             => throw new InvalidOperationException($"Unknown vehicle type: {e.VehicleType}")
            };
            v.ImageUrl = e.ImageUrl;
            v.Reservations = e.Reservations.Select(MapToReservation).ToList();
            return v;
        }

        private static Reservation MapToReservation(ReservationEntity r) => new()
        {
            Id = r.Id,
            CreatedAt = r.CreatedAt,
            Driver = new Driver(r.DriverName, r.DriverSurname, r.DriverDateOfBirth, r.DriverLicenseNumber),
            Schedule = new Schedule { PickupDate = r.PickupDate, DropoffDate = r.DropoffDate },
        };

        private static VehicleEntity MapToEntity(Vehicle v) => new()
        {
            RegistrationNumber = v.RegistrationNumber,
            VehicleType = GetTypeName(v),
            Make = v.Make,
            Model = v.Model,
            DailyRentalPrice = v.DailyRentalPrice,
            ImageUrl = v.ImageUrl,
            BodyStyle      = v is Car c ? c.BodyStyle : null,
            NumberOfSeats  = v is Car cc ? cc.NumberOfSeats : null,
            BatteryCapacity = v is ElectricCar ev ? ev.BatteryCapacity : null,
            RangePerCharge  = v is ElectricCar evv ? evv.RangePerCharge : null,
            CargoSpace     = v is Van van ? van.CargoSpace : null,
            IsPassengerVan = v is Van vanv ? vanv.IsPassengerVan : null,
            EngineSize     = v is Motorbike mb ? mb.EngineSize : null,
            HasSideCar     = v is Motorbike mbv ? mbv.HasSideCar : null,
        };

        private static string GetTypeName(Vehicle v) => v switch
        {
            Car => "Car", ElectricCar => "ElectricCar",
            Van => "Van", Motorbike => "Motorbike",
            _ => "Unknown"
        };
    }
}
