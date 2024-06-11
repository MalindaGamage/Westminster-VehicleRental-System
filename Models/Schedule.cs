using WestminsterVehicleRentalSystem.Interfaces;
using WestminsterVehicleRentalSystem.Utilities;

namespace WestminsterVehicleRentalSystem.Models
{
    public class Schedule : IOverlappable
    {
        public DateTime PickupDate { get; set; }
        public DateTime DropoffDate { get; set; }

        // Checks if this schedule overlaps with another schedule
        public bool Overlaps(Schedule other)
        {
            // Returns true if there's any day that's in both schedules
            return DateUtils.DoRangesOverlap(this.PickupDate, this.DropoffDate, other.PickupDate, other.DropoffDate);
        }
    }
}

