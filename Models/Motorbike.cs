namespace WestminsterVehicleRentalSystem.Models
{
    public class Motorbike : Vehicle
    {
        public int EngineSize { get; set; }
        public bool HasSideCar { get; set; }
        public Motorbike(string registrationNumber, string make, string model, double dailyRentalPrice, int engineSize, bool hasSideCar) 
            : base(registrationNumber, make, model, dailyRentalPrice)
        {
            EngineSize = engineSize;
            HasSideCar = hasSideCar;
        }
        public override void DisplayInfo()
        {
            Console.WriteLine($"Motorbike: {Make} {Model}, Daily Price: {DailyRentalPrice}");
        }
    }
}
