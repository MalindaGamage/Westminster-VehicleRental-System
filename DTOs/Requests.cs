namespace WestminsterVehicleRentalSystem.DTOs
{
    public class AddVehicleRequest
    {
        public required string VehicleType { get; set; }
        public required string RegistrationNumber { get; set; }
        public required string Make { get; set; }
        public required string Model { get; set; }
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
    }

    public class AddReservationRequest
    {
        public required DriverRequest Driver { get; set; }
        public required ScheduleRequest Schedule { get; set; }
    }

    public class UpdateReservationRequest
    {
        public required ScheduleRequest Schedule { get; set; }
    }

    public class DriverRequest
    {
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public required string DateOfBirth { get; set; }
        public required string LicenseNumber { get; set; }
    }

    public class ScheduleRequest
    {
        public required string PickupDate { get; set; }
        public required string DropoffDate { get; set; }
    }
}
