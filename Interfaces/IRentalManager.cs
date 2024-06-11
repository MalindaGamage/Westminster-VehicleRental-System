using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WestminsterVehicleRentalSystem.Models;

namespace WestminsterVehicleRentalSystem.Interfaces
{
    public interface IRentalManager
    {
        bool AddVehicle(Vehicle v);
        bool DeleteVehicle(string number);
        void ListVehicles();
        void ListOrderedVehicles();
        void GenerateReport(string fileName);
    }
}
