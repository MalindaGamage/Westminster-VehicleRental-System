using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WestminsterVehicleRentalSystem.Models;

namespace WestminsterVehicleRentalSystem.Interfaces
{
    public interface IRentalCustomer
    {
        void ListAvailableVehicles(Schedule wantedSchedule, Type type);
        bool AddReservation(string number, Schedule wantedSchedule);
        bool ChangeReservation(string number, Schedule oldSchedule, Schedule newSchedule);
        bool DeleteReservation(string number, Schedule schedule);
    }
}
