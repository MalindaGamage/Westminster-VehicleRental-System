namespace WestminsterVehicleRentalSystem.Models
{
    public abstract class Vehicle
    {
        public string RegistrationNumber { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public double DailyRentalPrice { get; set; }
        public List<Reservation> Reservations { get; set; } = new List<Reservation>();

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
            // Check if the new reservation overlaps with any existing reservations
            foreach (var existingReservation in Reservations)
            {
                if (existingReservation.Schedule.Overlaps(reservation.Schedule))
                {
                    return false; // Overlap found, do not add the new reservation
                }
            }

            // No overlap, safe to add the new reservation
            Reservations.Add(reservation);
            return true;
        }
    }
}
