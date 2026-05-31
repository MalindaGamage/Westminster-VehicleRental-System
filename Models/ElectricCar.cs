namespace WestminsterVehicleRentalSystem.Models
{
    public class ElectricCar : Vehicle
    {
        public double BatteryCapacity { get; set; }
        public double RangePerCharge { get; set; }

        public ElectricCar() { }

        public ElectricCar(string registrationNumber, string make, string model, double dailyRentalPrice,
                           double batteryCapacity, double rangePerCharge)
            : base(registrationNumber, make, model, dailyRentalPrice)
        {
            BatteryCapacity = batteryCapacity;
            RangePerCharge = rangePerCharge;
        }

        public override void DisplayInfo() =>
            Console.WriteLine($"Electric Car: {Make} {Model}, Reg: {RegistrationNumber}, Daily: £{DailyRentalPrice}");
    }
}
