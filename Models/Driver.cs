namespace WestminsterVehicleRentalSystem.Models
{
    public class Driver
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string LicenseNumber { get; set; } = string.Empty;

        public Driver() { }

        public Driver(string name, string surname, DateTime dateOfBirth, string licenseNumber)
        {
            Name = name;
            Surname = surname;
            DateOfBirth = dateOfBirth;
            LicenseNumber = licenseNumber;
        }
    }
}
