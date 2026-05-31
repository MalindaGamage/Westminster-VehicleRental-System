using Microsoft.AspNetCore.Mvc;
using WestminsterVehicleRentalSystem.DTOs;
using WestminsterVehicleRentalSystem.Models;
using WestminsterVehicleRentalSystem.Services;

namespace WestminsterVehicleRentalSystem.Controllers
{
    [ApiController]
    [Route("api/vehicles")]
    public class VehiclesController : ControllerBase
    {
        private readonly WestminsterRentalVehicle _service;

        public VehiclesController(WestminsterRentalVehicle service) => _service = service;

        // GET /api/vehicles
        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetVehicles());

        // GET /api/vehicles/available?from=2026-06-01&to=2026-06-05&type=Car
        [HttpGet("available")]
        public IActionResult GetAvailable([FromQuery] string from, [FromQuery] string to,
                                          [FromQuery] string? type)
        {
            if (!DateTime.TryParse(from, out var pickup) || !DateTime.TryParse(to, out var dropoff))
                return BadRequest("Invalid date format. Use yyyy-MM-dd.");

            if (pickup >= dropoff)
                return BadRequest("Pickup must be before dropoff.");

            var schedule = new Schedule { PickupDate = pickup, DropoffDate = dropoff };
            return Ok(_service.GetAvailableVehicles(schedule, type));
        }

        // POST /api/vehicles
        [HttpPost]
        public IActionResult Add([FromBody] AddVehicleRequest req)
        {
            Vehicle vehicle;
            try
            {
                vehicle = req.VehicleType switch
                {
                    "Car" => new Car(req.RegistrationNumber.ToUpper(), req.Make, req.Model,
                                    req.DailyRentalPrice, req.BodyStyle ?? "Saloon", req.NumberOfSeats ?? 5)
                             { ImageUrl = req.ImageUrl },

                    "ElectricCar" => new ElectricCar(req.RegistrationNumber.ToUpper(), req.Make, req.Model,
                                                     req.DailyRentalPrice, req.BatteryCapacity ?? 0,
                                                     req.RangePerCharge ?? 0)
                                     { ImageUrl = req.ImageUrl },

                    "Van" => new Van(req.RegistrationNumber.ToUpper(), req.Make, req.Model,
                                    req.DailyRentalPrice, req.CargoSpace ?? 0, req.IsPassengerVan ?? false)
                             { ImageUrl = req.ImageUrl },

                    "Motorbike" => new Motorbike(req.RegistrationNumber.ToUpper(), req.Make, req.Model,
                                                 req.DailyRentalPrice, req.EngineSize ?? 0,
                                                 req.HasSideCar ?? false)
                                   { ImageUrl = req.ImageUrl },

                    _ => throw new ArgumentException($"Unknown vehicle type: {req.VehicleType}")
                };
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            return _service.AddVehicle(vehicle)
                ? Created($"/api/vehicles/{vehicle.RegistrationNumber}", vehicle)
                : Conflict("Vehicle already exists or parking is full (max 50).");
        }

        // DELETE /api/vehicles/{reg}
        [HttpDelete("{reg}")]
        public IActionResult Delete(string reg) =>
            _service.DeleteVehicle(reg) ? NoContent() : NotFound($"Vehicle '{reg}' not found.");

        // GET /api/vehicles/{reg}
        [HttpGet("{reg}")]
        public IActionResult GetOne(string reg)
        {
            var v = _service.GetVehicles().FirstOrDefault(v => v.RegistrationNumber == reg);
            return v != null ? Ok(v) : NotFound();
        }

        // POST /api/vehicles/{reg}/reservations
        [HttpPost("{reg}/reservations")]
        public IActionResult AddReservation(string reg, [FromBody] AddReservationRequest req)
        {
            if (!DateTime.TryParse(req.Schedule.PickupDate, out var pickup) ||
                !DateTime.TryParse(req.Schedule.DropoffDate, out var dropoff))
                return BadRequest("Invalid date format.");

            if (pickup >= dropoff)
                return BadRequest("Pickup must be before dropoff.");

            var driver = new Driver(req.Driver.Name, req.Driver.Surname,
                DateTime.TryParse(req.Driver.DateOfBirth, out var dob) ? dob : DateTime.UtcNow.AddYears(-25),
                req.Driver.LicenseNumber);

            var schedule = new Schedule { PickupDate = pickup, DropoffDate = dropoff };
            var reservation = _service.AddReservation(reg, schedule, driver);

            return reservation != null
                ? Created($"/api/vehicles/{reg}/reservations/{reservation.Id}", reservation)
                : Conflict("Dates overlap an existing reservation or vehicle not found.");
        }

        // PUT /api/vehicles/{reg}/reservations/{id}
        [HttpPut("{reg}/reservations/{id}")]
        public IActionResult UpdateReservation(string reg, string id, [FromBody] UpdateReservationRequest req)
        {
            if (!DateTime.TryParse(req.Schedule.PickupDate, out var pickup) ||
                !DateTime.TryParse(req.Schedule.DropoffDate, out var dropoff))
                return BadRequest("Invalid date format.");

            if (pickup >= dropoff)
                return BadRequest("Pickup must be before dropoff.");

            var schedule = new Schedule { PickupDate = pickup, DropoffDate = dropoff };
            return _service.ChangeReservationById(reg, id, schedule)
                ? Ok()
                : Conflict("Dates overlap or reservation not found.");
        }

        // DELETE /api/vehicles/{reg}/reservations/{id}
        [HttpDelete("{reg}/reservations/{id}")]
        public IActionResult DeleteReservation(string reg, string id) =>
            _service.DeleteReservationById(reg, id) ? NoContent() : NotFound();

        // GET /api/vehicles/report
        [HttpGet("report")]
        public IActionResult GetReport() => Ok(new { text = _service.GenerateReportText() });
    }
}
