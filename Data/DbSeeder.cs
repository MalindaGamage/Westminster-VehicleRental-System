namespace WestminsterVehicleRentalSystem.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext db)
        {
            if (db.Vehicles.Any()) return; // already seeded

            var vehicles = new List<VehicleEntity>
            {
                new() { RegistrationNumber="WP-CAA-1001", VehicleType="Car", Make="Toyota", Model="Axio",
                    DailyRentalPrice=8500, BodyStyle="Saloon", NumberOfSeats=5,
                    ImageUrl="https://images.unsplash.com/photo-1626072557464-90403d788e8d?w=800&q=80" },

                new() { RegistrationNumber="WP-CAB-2002", VehicleType="Car", Make="Toyota", Model="Allion",
                    DailyRentalPrice=10500, BodyStyle="Saloon", NumberOfSeats=5,
                    ImageUrl="https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80",
                    Reservations = new List<ReservationEntity>
                    {
                        new() { Id="res00001", VehicleRegistration="WP-CAB-2002", CreatedAt="2026-05-28",
                            DriverName="Malinda", DriverSurname="Gamage",
                            DriverDateOfBirth=new DateTime(1997,5,11), DriverLicenseNumber="971321300V",
                            PickupDate=new DateTime(2026,6,5), DropoffDate=new DateTime(2026,6,10) }
                    }},

                new() { RegistrationNumber="CP-EV-3001", VehicleType="ElectricCar", Make="Nissan", Model="Leaf",
                    DailyRentalPrice=15000, BatteryCapacity=40, RangePerCharge=240,
                    ImageUrl="https://images.unsplash.com/photo-1611580568467-a8e2bb344bbf?w=800&q=80" },

                new() { RegistrationNumber="SP-EV-4002", VehicleType="ElectricCar", Make="Toyota", Model="Prius PHV",
                    DailyRentalPrice=13500, BatteryCapacity=8.8, RangePerCharge=68,
                    ImageUrl="https://images.unsplash.com/photo-1638618164682-12b986ec2a75?w=800&q=80" },

                new() { RegistrationNumber="WP-KDH-5001", VehicleType="Van", Make="Toyota", Model="KDH Van",
                    DailyRentalPrice=11000, CargoSpace=6.5, IsPassengerVan=true,
                    ImageUrl="https://images.unsplash.com/photo-1658489199682-b3bccbd21885?w=800&q=80" },

                new() { RegistrationNumber="NC-L300-6001", VehicleType="Van", Make="Mitsubishi", Model="L300",
                    DailyRentalPrice=8000, CargoSpace=5.5, IsPassengerVan=false,
                    ImageUrl="https://images.unsplash.com/photo-1733965961857-99e62b0fc869?w=800&q=80" },

                new() { RegistrationNumber="WP-PLS-7001", VehicleType="Motorbike", Make="Bajaj", Model="Pulsar 220F",
                    DailyRentalPrice=3500, EngineSize=220, HasSideCar=false,
                    ImageUrl="https://images.unsplash.com/photo-1697683051660-01921a39bb62?w=800&q=80" },

                new() { RegistrationNumber="WP-CB1-8001", VehicleType="Motorbike", Make="Honda", Model="CB150R",
                    DailyRentalPrice=4500, EngineSize=150, HasSideCar=false,
                    ImageUrl="https://images.unsplash.com/photo-1615572766543-06c21416eb05?w=800&q=80" },
            };

            db.Vehicles.AddRange(vehicles);
            db.SaveChanges();
        }
    }
}
