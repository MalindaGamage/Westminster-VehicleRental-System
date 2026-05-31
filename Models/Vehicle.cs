using System.Text.Json.Serialization;

namespace WestminsterVehicleRentalSystem.Models
{
    [JsonPolymorphic(TypeDiscriminatorPropertyName = "vehicleType")]
    [JsonDerivedType(typeof(Car), "Car")]
    [JsonDerivedType(typeof(ElectricCar), "ElectricCar")]
    [JsonDerivedType(typeof(Van), "Van")]
    [JsonDerivedType(typeof(Motorbike), "Motorbike")]
    public abstract class Vehicle
    {
        public string RegistrationNumber { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public double DailyRentalPrice { get; set; }
        public string? ImageUrl { get; set; }
        public List<Reservation> Reservations { get; set; } = new();

        protected Vehicle() { }

        protected Vehicle(string registrationNumber, string make, string model, double dailyRentalPrice)
        {
            RegistrationNumber = registrationNumber;
            Make = make;
            Model = model;
            DailyRentalPrice = dailyRentalPrice;
        }

        public abstract void DisplayInfo();

        public bool AddReservation(Reservation reservation)
        {
            foreach (var existing in Reservations)
            {
                if (existing.Schedule.Overlaps(reservation.Schedule))
                    return false;
            }
            Reservations.Add(reservation);
            return true;
        }
    }
}
