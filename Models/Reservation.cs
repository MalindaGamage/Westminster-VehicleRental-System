using System.Text.Json.Serialization;
using WestminsterVehicleRentalSystem.Models;

public class Reservation
{
    public string Id { get; set; } = Guid.NewGuid().ToString()[..8];
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

    [JsonIgnore]
    public Vehicle? Vehicle { get; set; }

    public required Driver Driver { get; set; }
    public required Schedule Schedule { get; set; }
}
