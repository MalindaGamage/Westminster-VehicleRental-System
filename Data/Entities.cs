using System.ComponentModel.DataAnnotations;

namespace WestminsterVehicleRentalSystem.Data
{
    /// <summary>
    /// Flat table — nullable columns hold type-specific fields.
    /// One row per vehicle regardless of subtype.
    /// </summary>
    public class VehicleEntity
    {
        [Key]
        public string RegistrationNumber { get; set; } = "";
        public string VehicleType { get; set; } = "";   // Car | ElectricCar | Van | Motorbike
        public string Make { get; set; } = "";
        public string Model { get; set; } = "";
        public double DailyRentalPrice { get; set; }
        public string? ImageUrl { get; set; }

        // Car
        public string? BodyStyle { get; set; }
        public int? NumberOfSeats { get; set; }

        // ElectricCar
        public double? BatteryCapacity { get; set; }
        public double? RangePerCharge { get; set; }

        // Van
        public double? CargoSpace { get; set; }
        public bool? IsPassengerVan { get; set; }

        // Motorbike
        public int? EngineSize { get; set; }
        public bool? HasSideCar { get; set; }

        public ICollection<ReservationEntity> Reservations { get; set; } = new List<ReservationEntity>();
    }

    public class ReservationEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString()[..8];
        public string VehicleRegistration { get; set; } = "";
        public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

        // Driver (flattened — avoids a third join table)
        public string DriverName { get; set; } = "";
        public string DriverSurname { get; set; } = "";
        public DateTime DriverDateOfBirth { get; set; }
        public string DriverLicenseNumber { get; set; } = "";

        public DateTime PickupDate { get; set; }
        public DateTime DropoffDate { get; set; }
    }
}
