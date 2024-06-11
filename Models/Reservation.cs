using WestminsterVehicleRentalSystem.Models;

public class Reservation
{
    public required Vehicle Vehicle { get; set; }
    public required Driver Driver { get; set; }
    public required Schedule Schedule { get; set; }
  
}
