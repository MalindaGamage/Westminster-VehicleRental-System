using System;
using WestminsterVehicleRentalSystem.Models;

namespace WestminsterVehicleRentalSystem.Interfaces
{
    public interface IOverlappable
    {
        bool Overlaps(Schedule other);
    }
}
