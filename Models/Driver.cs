namespace WestminsterVehicleRentalSystem.Models
{
    public class Driver
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string LicenseNumber { get; set; }
        public Driver( string name, string surname, DateTime dateOfBirth, string licenseNumber)
        {
            Name = name;
            Surname = surname;
            DateOfBirth = dateOfBirth;
            LicenseNumber = licenseNumber;
        }
    }
}
