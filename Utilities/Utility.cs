using WestminsterVehicleRentalSystem.Models;

namespace WestminsterVehicleRentalSystem.Utilities
{
    public static class Utility
    {
        public static string ReadString(string prompt)
        {
            string input;
            do
            {
                Console.Write(prompt);
                input = Console.ReadLine().Trim();
                if (!string.IsNullOrWhiteSpace(input))
                {
                    return input;
                }
                Console.WriteLine("Input cannot be empty. Please try again.");
            } while (true);
        }

        public static double ReadDouble(string prompt, double min = Double.MinValue, double max = Double.MaxValue)
        {
            double value;
            Console.Write(prompt);
            while (!double.TryParse(Console.ReadLine(), out value) || value < min || value > max)
            {
                Console.WriteLine($"Please enter a valid number between {min} and {max}.");
                Console.Write(prompt);
            }
            return value;
        }

        public static int ReadInt(string prompt, int min, int max)
        {
            int choice;
            do
            {
                Console.Write(prompt);
                if (!int.TryParse(Console.ReadLine(), out choice) || choice < min || choice > max)
                {
                    Console.WriteLine($"Please enter a number between {min} and {max}.");
                }
                else
                {
                    return choice;
                }
            } while (true);
        }

        public static DateTime ReadDate(string prompt)
        {
            DateTime date;
            do
            {
                Console.Write(prompt);
                if (!DateTime.TryParse(Console.ReadLine(), out date))
                {
                    Console.WriteLine("Invalid date format. Please use 'yyyy-mm-dd'.");
                }
                else
                {
                    return date;
                }
            } while (true);
        }

        public static bool ReadBool(string prompt)
        {
            string input;
            do
            {
                Console.Write(prompt);
                input = Console.ReadLine().ToLower();
                if (input == "yes" || input == "y") return true;
                if (input == "no" || input == "n") return false;
                Console.WriteLine("Please enter 'yes' or 'no'.");
            } while (true);
        }

        public static bool ConfirmAction(string message)
        {
            Console.WriteLine($"{message} (yes/no):");
            string input = Console.ReadLine()?.Trim().ToLower();
            return input == "yes" || input == "y";
        }

        public static string SanitizeFileName(string fileName)
        {
            var invalidChars = Path.GetInvalidFileNameChars();
            var validFileName = new string(fileName.Where(ch => !invalidChars.Contains(ch)).ToArray());
            return string.IsNullOrWhiteSpace(validFileName) ? "VehicleReport" : validFileName;
        }

        public static string GetReportFilePath(string fileName)
        {
            string projectDirectory = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\"));
            string fullPath = Path.Combine(projectDirectory, "Reports", fileName); // Saving reports in a Reports folder

            // Ensure the Reports directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(fullPath));

            return fullPath;
        }

        public static Type ResolveVehicleType(string typeName)
        {
            switch (typeName.ToLower())
            {
                case "car":
                    return typeof(Car);
                case "electriccar":
                    return typeof(ElectricCar);
                case "van":
                    return typeof(Van);
                case "motorbike":
                    return typeof(Motorbike);
                default:
                    return null;
            }
        }

        public static string ReadVehicleType()
        {
            while (true)
            {
                string input = Utility.ReadString("Enter vehicle type (Car, ElectricCar, Van, Motorbike): ");
                var validTypes = new List<string> { "Car", "ElectricCar", "Van", "Motorbike" };
                if (validTypes.Contains(input, StringComparer.OrdinalIgnoreCase))
                {
                    return input;
                }

                Console.WriteLine("Invalid vehicle type. Please enter one of the following: Car, ElectricCar, Van, Motorbike.");
            }
        }
    }
}