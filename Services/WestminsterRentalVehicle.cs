using System.Text;
using System.Text.Json;
using WestminsterVehicleRentalSystem.Interfaces;
using WestminsterVehicleRentalSystem.Models;


namespace WestminsterVehicleRentalSystem.Services
{
    public class WestminsterRentalVehicle : IRentalManager, IRentalCustomer
    {
        private readonly List<Vehicle> vehicles;
        private readonly string vehiclesFilePath;
        private const int MaxParkingSlots = 50;

        public WestminsterRentalVehicle(string vehiclesFilePath)
        {
            this.vehiclesFilePath = vehiclesFilePath;
            vehicles = LoadVehiclesFromFile(vehiclesFilePath) ?? new List<Vehicle>();
        }

        public bool AddVehicle(Vehicle v)
        {
            if (vehicles.Count >= MaxParkingSlots || vehicles.Any(veh => veh.RegistrationNumber == v.RegistrationNumber))
            {
                return false; // Parking lot is full or vehicle already exists
            }

            vehicles.Add(v);
            Console.WriteLine($"Vehicle added successfully. Available parking lots: {MaxParkingSlots - vehicles.Count}");
            return true;
        }

        public bool DeleteVehicle(string number)
        {
            var vehicle = vehicles.FirstOrDefault(v => v.RegistrationNumber == number);
            if (vehicle == null)
            {
                return false; // Vehicle not found
            }

            vehicles.Remove(vehicle);
            Console.WriteLine($"Vehicle {number} deleted. Available parking lots: {MaxParkingSlots - vehicles.Count}");
            return true;
        }

        public void ListVehicles()
        {
            foreach (var vehicle in vehicles)
            {
                vehicle.DisplayInfo();
            }
        }

        public void ListOrderedVehicles()
        {
            var orderedVehicles = vehicles.OrderBy(v => v.Make).ToList();
            foreach (var vehicle in orderedVehicles)
            {
                vehicle.DisplayInfo();
            }
        }

        public void GenerateReport(string fileName)
        {
            string projectDirectory = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\.."));
            string fullPath = Path.Combine(projectDirectory, fileName);

            StringBuilder reportContent = new StringBuilder();

            foreach (var vehicle in vehicles)
            {
                reportContent.AppendLine($"Vehicle: {vehicle.RegistrationNumber}, {vehicle.Make}, {vehicle.Model}, Daily Rental Price: {vehicle.DailyRentalPrice}");
                foreach (var reservation in vehicle.Reservations.OrderBy(r => r.Schedule.PickupDate))
                {
                    reportContent.AppendLine($"\tReservation - Pickup: {reservation.Schedule.PickupDate.ToShortDateString()}, Drop-off: {reservation.Schedule.DropoffDate.ToShortDateString()}, Driver: {reservation.Driver.Name} {reservation.Driver.Surname}");
                }
            }

            File.WriteAllText(fileName, reportContent.ToString());
            Console.WriteLine($"Report generated and saved to {fileName}");

            // Now use fullPath to write your report
            // Example: File.WriteAllText(fullPath, "Report content...");
        }


        public void ListAvailableVehicles(Schedule wantedSchedule, Type vehicleType)
        {
            // Filter the vehicles list to find those that match the given type
            // and have no reservations overlapping with the wanted schedule.
            var availableVehicles = vehicles
                .Where(v => v.GetType() == vehicleType &&
                            v.Reservations.All(r => !r.Schedule.Overlaps(wantedSchedule)))
                .ToList();

            // Check if any vehicles meet the criteria
            if (availableVehicles.Any())
            {
                // If so, iterate over the filtered list and call DisplayInfo() on each vehicle
                foreach (var vehicle in availableVehicles)
                {
                    vehicle.DisplayInfo(); // Assumes DisplayInfo is implemented to print relevant vehicle details
                }
            }
            else
            {
                // If no vehicles meet the criteria, inform the user
                Console.WriteLine("No available vehicles found for the specified schedule.");
            }
        }

        public bool AddReservation(string number, Schedule wantedSchedule)
        {
            var vehicle = vehicles.FirstOrDefault(v => v.RegistrationNumber == number);
            if (vehicle == null)
            {
                Console.WriteLine($"Vehicle with registration number {number} does not exist.");
                return false;
            }

            // Check for overlap with existing reservations
            bool overlaps = vehicle.Reservations.Any(reservation => reservation.Schedule.Overlaps(wantedSchedule));
            if (overlaps)
            {
                Console.WriteLine("Failed to add reservation due to schedule overlap.");
                return false;
            }

            var reservation = new Reservation
            {
                Vehicle = vehicle,
                Schedule = wantedSchedule,
                Driver = new Driver("Malinda", "Gamage", new DateTime(1997, 05, 11), "971321300V") 
            };
            vehicle.Reservations.Add(reservation);
            Console.WriteLine($"Reservation added for vehicle {number}.");
            return true;
        }

        public bool ChangeReservation(string number, Schedule oldSchedule, Schedule newSchedule)
        {
            var vehicle = vehicles.FirstOrDefault(v => v.RegistrationNumber == number);
            if (vehicle == null) return false;

            var reservation = vehicle.Reservations.FirstOrDefault(r => r.Schedule.Equals(oldSchedule));
            if (reservation == null) return false;

            if (vehicle.Reservations.Any(r => r.Schedule.Overlaps(newSchedule))) return false;

            reservation.Schedule = newSchedule;
            Console.WriteLine("Reservation schedule updated successfully.");
            return true;
        }

        public bool DeleteReservation(string number, Schedule schedule)
        {
            var vehicle = vehicles.FirstOrDefault(v => v.RegistrationNumber == number);
            if (vehicle == null) return false;

            var reservation = vehicle.Reservations.FirstOrDefault(r => r.Schedule.Equals(schedule));
            if (reservation == null) return false;

            vehicle.Reservations.Remove(reservation);
            Console.WriteLine("Reservation deleted successfully.");
            return true;
        }

        public bool VehicleExists(string registrationNumber)
        {
            return vehicles.Any(v => string.Equals(v.RegistrationNumber, registrationNumber, StringComparison.OrdinalIgnoreCase));
        }

        public void SaveVehiclesToFile()
        {
            try
            {
                string json = JsonSerializer.Serialize(vehicles, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(vehiclesFilePath, json);
            }
            catch (Exception)
            {
                // Log or handle the exception as needed
                Console.WriteLine("Failed to save vehicles to file.");
            }
        }

        public List<Vehicle> LoadVehiclesFromFile(string filePath)
        {
            if (!File.Exists(filePath))
            {
                return new List<Vehicle>();
            }

            try
            {
                string json = File.ReadAllText(filePath);
                return JsonSerializer.Deserialize<List<Vehicle>>(json) ?? new List<Vehicle>();
            }
            catch (Exception)
            {
                // Log or handle the exception as needed
                Console.WriteLine("Failed to load vehicles from file.");
                return new List<Vehicle>();
            }
        }
    }
}