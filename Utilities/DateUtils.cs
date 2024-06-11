namespace WestminsterVehicleRentalSystem.Utilities
{
    internal static class DateUtils
    {
        // Checks if a given date falls within a specified date range (inclusive).
        public static bool IsDateInRange(DateTime dateToCheck, DateTime startDate, DateTime endDate)
        {
            return dateToCheck >= startDate && dateToCheck <= endDate;
        }

        // Calculates the number of full days between two dates.
        public static int DaysBetween(DateTime startDate, DateTime endDate)
        {
            if (endDate < startDate)
            {
                throw new ArgumentException("End date must be greater than or equal to start date.");
            }
            return (endDate - startDate).Days;
        }

        // Determines if two date ranges overlap.
        public static bool DoRangesOverlap(DateTime start1, DateTime end1, DateTime start2, DateTime end2)
        {
            return start1 <= end2 && start2 <= end1;
        }
    }
}
