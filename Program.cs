using WestminsterVehicleRentalSystem.Services;
using WestminsterVehicleRentalSystem.Models;
using WestminsterVehicleRentalSystem.Utilities;

class Program

{
    private static readonly WestminsterRentalVehicle rentalService = new WestminsterRentalVehicle("vehicles.json");

    static void Main(string[] args)
    {
        rentalService.LoadVehiclesFromFile("vehicles.json"); // Load at the start
        ShowMainMenu();
        rentalService.SaveVehiclesToFile(); // Save at the end or via a specific option
    }

    private static void ShowMainMenu()
    {
        while (true)
        {
            Console.WriteLine("\nWelcome to Westminster Vehicle Rental System\n");
            Console.WriteLine("1. A Customer\n2. An Admin\n3. Exit");
            int roleChoice = Utility.ReadInt("Select your role (1-3): ", 1, 3);

            switch (roleChoice)
            {
                case 1:
                    ShowCustomerMenu();
                    break;
                case 2:
                    ShowAdminMenu();
                    break;
                case 3:
                    return; // Exit the loop and program.
                default:
                    Console.WriteLine("Invalid option, please try again.");
                    break;
            }
        }
    }

    private static void ShowCustomerMenu()
    {
        bool exitMenu = false;
        while (!exitMenu)
        {
            Console.WriteLine("\nCustomer Menu:\n");
            Console.WriteLine("1. List All Vehicles\n2. List Available Vehicles\n3. Add New Reservation\n4. Modify Reservation\n5. Delete Reservation\n6. Back to Main Menu");
            int choice = Utility.ReadInt("Select an option (1-6): ", 1, 6);

            switch (choice)
            {
                case 1:
                    rentalService.ListVehicles();
                    break;
                case 2:
                    ListAvailableVehicles();
                    break;
                case 3:
                    AddNewReservation();
                    break;
                case 4:
                    ModifyReservation();
                    break;
                case 5:
                    DeleteReservation();
                    break;
                case 6:
                    exitMenu = true; // Exit to main menu.
                    break;
                default:
                    Console.WriteLine("Invalid option, please try again.");
                    break;
            }
        }
    }

    private static void ShowAdminMenu()
    {
        bool exitMenu = false;
        while (!exitMenu)
        {
            Console.WriteLine("\nAdmin Menu:\n");
            Console.WriteLine("1. Add New Vehicle\n2. Delete Vehicle\n3. List All Vehicles\n4. List Ordered Vehicles\n5. Generate Report\n6. Back to Main Menu");
            int choice = Utility.ReadInt("Select an option (1-6): ", 1, 6);

            switch (choice)
            {
                case 1:
                    AddNewVehicle();
                    break;
                case 2:
                    DeleteVehicle();
                    break;
                case 3:
                    rentalService.ListVehicles();
                    break;
                case 4:
                    rentalService.ListOrderedVehicles();
                    break;
                case 5:
                    GenerateReport();
                    break;
                case 6:
                    exitMenu = true; // Exit to main menu.
                    break;
                default:
                    Console.WriteLine("Invalid option, please try again.");
                    break;
            }
        }
    }
    static void AddNewVehicle()
    {
        Console.WriteLine("Select the type of vehicle to add:");
        Console.WriteLine("1. Car");
        Console.WriteLine("2. Electric Car");
        Console.WriteLine("3. Van");
        Console.WriteLine("4. Motorbike");

        int vehicleTypeChoice = Utility.ReadInt("Select the type of vehicle to add (1-4): ", 1, 4);

        string registrationNumber = Utility.ReadString("Registration Number: ");
        string make = Utility.ReadString("Make: ");
        string model = Utility.ReadString("Model: ");
        double dailyRentalPrice = Utility.ReadDouble("Enter Daily Rental Price: ");

        Vehicle? vehicleToAdd = null;

        switch (vehicleTypeChoice)
        {
            case 1: // Car
                string bodyStyle = Utility.ReadString("Body Style: ");
                int numberOfSeats = Utility.ReadInt("Number Of Seats: ", 1, Int32.MaxValue);
                vehicleToAdd = new Car(registrationNumber, make, model, dailyRentalPrice, bodyStyle, numberOfSeats);
                break;

            case 2: // Electric Car
                double batteryCapacity = Utility.ReadDouble("Battery Capacity (in kWh): ", 0.1, Double.MaxValue);
                double rangePerCharge = Utility.ReadDouble("Range Per Charge (in km): ", 1, Double.MaxValue);
                vehicleToAdd = new ElectricCar(registrationNumber, make, model, dailyRentalPrice, batteryCapacity, rangePerCharge);
                break;

            case 3: // Van
                double cargoSpace = Utility.ReadDouble("Cargo Space (in cubic meters): ", 0.1, Double.MaxValue);
                bool isPassengerVan = Utility.ReadBool("Is it a Passenger Van? (yes/no): ");
                vehicleToAdd = new Van(registrationNumber, make, model, dailyRentalPrice, cargoSpace, isPassengerVan);
                break;

            case 4: // Motorbike
                int engineSize = Utility.ReadInt("Engine Size (in cc): ", 50, Int32.MaxValue); // Assuming 50cc as the minimum valid engine size.
                bool hasSideCar = Utility.ReadBool("Has Side Car? (yes/no): ");
                vehicleToAdd = new Motorbike(registrationNumber, make, model, dailyRentalPrice, engineSize, hasSideCar);
                break;

            default:
                Console.WriteLine("Invalid vehicle type selected. Returning to menu.");
                return;
        }

        if (rentalService.AddVehicle(vehicleToAdd))
        {
            Console.WriteLine("Vehicle added successfully.");
        }
        else
        {
            Console.WriteLine("Failed to add vehicle. It may already exist, or the parking lot is full.");
        }
    }
    static void DeleteVehicle()
    {
        string regNumber = Utility.ReadString("Enter the registration number of the vehicle to delete: ");

        if (string.IsNullOrWhiteSpace(regNumber))
        {
            Console.WriteLine("Registration number cannot be empty. Operation cancelled.");
            return;
        }

        // Check if the vehicle exists
        if (!rentalService.VehicleExists(regNumber))
        {
            Console.WriteLine($"Vehicle with registration number {regNumber} does not exist.");
            return;
        }

        // Confirm deletion
        if (Utility.ConfirmAction($"Are you sure you want to delete the vehicle with registration number {regNumber}?"))
        {
            // Attempt to delete the vehicle
            bool isDeleted = rentalService.DeleteVehicle(regNumber);
            if (isDeleted)
            {
                Console.WriteLine($"Vehicle with registration number {regNumber} has been successfully deleted.");
            }
            else
            {
                Console.WriteLine($"An error occurred while attempting to delete the vehicle with registration number {regNumber}.");
            }
        }
        else
        {
            Console.WriteLine("Vehicle deletion cancelled.");
        }
    }

    static void GenerateReport()
    {
        string fileName = Utility.ReadString("Enter the filename for the report (without extension): ");

        // Validate filename and apply a default if necessary
        if (string.IsNullOrWhiteSpace(fileName))
        {
            Console.WriteLine("Invalid filename. Using default 'VehicleReport'.");
            fileName = "VehicleReport";
        }

        // Sanitize filename to prevent invalid characters
        fileName = Utility.SanitizeFileName(fileName) + ".txt"; // Appending .txt extension

        // Determine full path to save the report
        string fullPath = Utility.GetReportFilePath(fileName);

        try
        {
            rentalService.GenerateReport(fullPath);
            Console.WriteLine($"Report has been generated and saved to: {fullPath}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while generating the report: {ex.Message}");
        }
    }

    static void ListAvailableVehicles()
    {
        string vehicleTypeInput = Utility.ReadVehicleType();
        DateTime pickupDate = Utility.ReadDate("Enter pickup date (yyyy-mm-dd): ");
        DateTime dropoffDate = Utility.ReadDate("Enter drop-off date (yyyy-mm-dd): ");

        // Ensure pickup date is before drop-off date
        if (pickupDate >= dropoffDate)
        {
            Console.WriteLine("The pickup date must be before the drop-off date.");
            return;
        }

        Schedule wantedSchedule = new Schedule { PickupDate = pickupDate, DropoffDate = dropoffDate };

        // Dynamically resolve the type based on user input
        Type vehicleType = Utility.ResolveVehicleType(vehicleTypeInput);

        if (vehicleType != null)
        {
            rentalService.ListAvailableVehicles(wantedSchedule, vehicleType);
        }
        else
        {
            Console.WriteLine("Invalid vehicle type provided.");
        }
    }

    static void AddNewReservation()
    {
        string registrationNumber = Utility.ReadString("Enter vehicle registration number: ").ToUpper(); // Normalize input

        // Validate vehicle existence before proceeding
        if (!rentalService.VehicleExists(registrationNumber))
        {
            Console.WriteLine("Vehicle with the given registration number does not exist.");
            return;
        }

        DateTime pickupDate = Utility.ReadDate("Enter pickup date (yyyy-mm-dd): ");
        DateTime dropoffDate = Utility.ReadDate("Enter drop-off date (yyyy-mm-dd): ");

        // Validate that the pickup date is before the drop-off date
        if (pickupDate >= dropoffDate)
        {
            Console.WriteLine("The pickup date must be before the drop-off date.");
            return;
        }

        Schedule wantedSchedule = new Schedule { PickupDate = pickupDate, DropoffDate = dropoffDate };

        // Attempt to add the reservation
        if (rentalService.AddReservation(registrationNumber, wantedSchedule))
        {
            Console.WriteLine("Reservation successfully added.");
        }
        else
        {
            // This message could be more specific based on the reasons for failure in AddReservation method
            Console.WriteLine("Failed to add reservation. The requested schedule may overlap with an existing reservation.");
        }
    }

    static void ModifyReservation()
    {
        string registrationNumber = Utility.ReadString("Enter vehicle registration number for the reservation to be modified: ");

        Console.WriteLine("Enter old pickup date (yyyy-mm-dd): ");
        DateTime oldPickupDate = Utility.ReadDate("Enter old pickup date (yyyy-mm-dd): ");

        Console.WriteLine("Enter old drop-off date (yyyy-mm-dd): ");
        DateTime oldDropoffDate = Utility.ReadDate("Enter old drop-off date (yyyy-mm-dd): ");

        if (oldPickupDate >= oldDropoffDate)
        {
            Console.WriteLine("Old pickup date must be before the old drop-off date. Please try again.");
            return;
        }

        Console.WriteLine("Enter new pickup date (yyyy-mm-dd): ");
        DateTime newPickupDate = Utility.ReadDate("Enter new pickup date (yyyy-mm-dd): ");

        Console.WriteLine("Enter new drop-off date (yyyy-mm-dd): ");
        DateTime newDropoffDate = Utility.ReadDate("Enter new drop-off date (yyyy-mm-dd): ");

        if (newPickupDate >= newDropoffDate)
        {
            Console.WriteLine("New pickup date must be before the new drop-off date. Please try again.");
            return;
        }

        Schedule oldSchedule = new Schedule { PickupDate = oldPickupDate, DropoffDate = oldDropoffDate };
        Schedule newSchedule = new Schedule { PickupDate = newPickupDate, DropoffDate = newDropoffDate };

        if (rentalService.ChangeReservation(registrationNumber, oldSchedule, newSchedule))
        {
            Console.WriteLine("Reservation successfully modified.");
        }
        else
        {
            Console.WriteLine("Failed to modify reservation. This could be due to overlapping schedules or invalid vehicle number.");
        }
    }

    static void DeleteReservation()
    {
        string registrationNumber = Utility.ReadString("Enter vehicle registration number for the reservation to be deleted: ");

        Console.WriteLine("Enter pickup date for the reservation to be deleted:");
        DateTime pickupDate = Utility.ReadDate("Enter pickup date (yyyy-mm-dd): ");

        Console.WriteLine("Enter drop-off date for the reservation to be deleted:");
        DateTime dropoffDate = Utility.ReadDate("Enter drop-off date (yyyy-mm-dd): ");

        if (pickupDate >= dropoffDate)
        {
            Console.WriteLine("Pickup date must be before the drop-off date. Please try again.");
            return; // Early return to prevent further execution if dates are invalid
        }

        Schedule scheduleToDelete = new Schedule { PickupDate = pickupDate, DropoffDate = dropoffDate };

        // Attempt to delete the reservation
        bool deletionSuccess = rentalService.DeleteReservation(registrationNumber, scheduleToDelete);

        if (deletionSuccess)
        {
            Console.WriteLine("Reservation successfully deleted.");
        }
        else
        {
            Console.WriteLine("Failed to delete reservation. Please check the details and try again.");
        }
    }

}
