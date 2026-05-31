using Microsoft.EntityFrameworkCore;

namespace WestminsterVehicleRentalSystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<VehicleEntity> Vehicles => Set<VehicleEntity>();
        public DbSet<ReservationEntity> Reservations => Set<ReservationEntity>();

        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<VehicleEntity>(e =>
            {
                e.HasKey(v => v.RegistrationNumber);
                e.HasMany(v => v.Reservations)
                 .WithOne()
                 .HasForeignKey(r => r.VehicleRegistration)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            mb.Entity<ReservationEntity>(e =>
            {
                e.HasKey(r => r.Id);
                e.HasIndex(r => r.VehicleRegistration);
            });
        }
    }
}
