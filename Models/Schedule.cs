using WestminsterVehicleRentalSystem.Interfaces;
using WestminsterVehicleRentalSystem.Utilities;

namespace WestminsterVehicleRentalSystem.Models
{
    public class Schedule : IOverlappable
    {
        public DateTime PickupDate { get; set; }
        public DateTime DropoffDate { get; set; }

        public bool Overlaps(Schedule other) =>
            DateUtils.DoRangesOverlap(PickupDate, DropoffDate, other.PickupDate, other.DropoffDate);
    }
}
