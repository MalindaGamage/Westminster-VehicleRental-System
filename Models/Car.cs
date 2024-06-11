namespace WestminsterVehicleRentalSystem.Models
{
    public class Car : Vehicle
    {
        public string BodyStyle { get; set; }
        public int NumberOfSeats { get; set; }
        public Car(string registrationNumber, string make, string model, double dailyRentalPrice, string bodyStyle, int numberOfSeats)
            : base(registrationNumber, make, model, dailyRentalPrice)
        {
            BodyStyle = bodyStyle;
            NumberOfSeats = numberOfSeats;
        }
        public override void DisplayInfo()
        {
            Console.WriteLine($"Car: {Make} {Model}, Daily Price: {DailyRentalPrice}");
        }
    }
}
