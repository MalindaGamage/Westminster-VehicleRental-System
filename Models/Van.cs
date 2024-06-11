namespace WestminsterVehicleRentalSystem.Models
{
    public class Van : Vehicle
    {
        public double CargoSpace { get; set; } // in cubic meters
        public bool IsPassengerVan { get; set; }
        public Van(string registrationNumber, string make, string model, double dailyRentalPrice, double cargoSpace, bool isPassengerVan)
            : base(registrationNumber, make, model, dailyRentalPrice)
        {
            CargoSpace = cargoSpace;
            IsPassengerVan = isPassengerVan;
        }
        public override void DisplayInfo()
        {
            Console.WriteLine($"Van: {Make} {Model}, Daily Price: {DailyRentalPrice}");
        }
    }
}
