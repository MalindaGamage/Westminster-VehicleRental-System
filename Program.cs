using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using WestminsterVehicleRentalSystem.Data;
using WestminsterVehicleRentalSystem.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────────────────────────
// Use PostgreSQL on Railway (DATABASE_URL set automatically by Railway),
// fall back to SQLite for local development.
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

if (!string.IsNullOrEmpty(databaseUrl))
{
    // Railway / production — PostgreSQL
    // Railway provides: postgresql://user:pass@host:port/dbname
    builder.Services.AddDbContextFactory<AppDbContext>(opt =>
        opt.UseNpgsql(databaseUrl));
}
else
{
    // Local development — SQLite
    builder.Services.AddDbContextFactory<AppDbContext>(opt =>
        opt.UseSqlite("Data Source=gvr.db"));
}

// ── Services ──────────────────────────────────────────────────────────────
builder.Services.AddSingleton<WestminsterRentalVehicle>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// ── CORS ──────────────────────────────────────────────────────────────────
var allowedOrigins = (Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? "http://localhost:3000")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()));

// ── Port (Railway sets PORT automatically) ────────────────────────────────
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ─────────────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Migrate & seed on startup ─────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<AppDbContext>>();
    using var db = factory.CreateDbContext();
    db.Database.EnsureCreated();   // creates tables if they don't exist
    DbSeeder.Seed(db);             // inserts demo data only if Vehicles table is empty
}

app.UseCors();
app.MapControllers();
app.Run();
