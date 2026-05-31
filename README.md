# Gamage Vehicle Rental System

A full-stack vehicle rental management system built by **Malinda Gamage**.

📹 [Demonstration Video](https://youtu.be/9zPB-BEF5sQ) · 📄 [UML Diagram](https://drive.google.com/file/d/1blB8LgIf21fcRc_HFzXFCaPf-gaCHL6d/view?usp=sharing) · 📝 [Explanation](https://docs.google.com/document/d/1CrdF1JATnQEP1Cydhld0ugH4XtUm2pDWsr1CLX0Rwr8/edit?usp=sharing)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | ASP.NET Core 8 Web API (C#) |
| Frontend | Next.js 16 · TypeScript · Tailwind CSS |
| Animations | Framer Motion |
| UI Design | UI/UX Pro Max design system |
| Data | JSON file persistence |

## Project Structure

```
Westminster-VehicleRental-System/
├── Controllers/          # REST API controllers
├── DTOs/                 # Request/response models
├── Interfaces/           # C# interfaces
├── Models/               # Domain models (Vehicle, Reservation …)
├── Services/             # Business logic
├── Utilities/            # Helpers
├── vehicles.json         # Seed data (Sri Lankan fleet)
├── Program.cs            # ASP.NET Core web host
└── ui/                   # Next.js 16 frontend
    └── src/
        ├── app/          # Pages: Home, Customer, Admin, Login, Reservations
        ├── components/   # UI + animation components
        └── lib/          # Store, API client, Auth context, Types
```

## Features

- **4 vehicle types** — Cars · Electric · Vans · Motorbikes
- **Role-based access control** — Admin and Customer portals with login
- **Full booking flow** — Search → Book → Modify → Cancel
- **Admin dashboard** — Fleet management, analytics, downloadable reports
- **LKR pricing** with real Sri Lankan vehicle fleet and photos
- **Animated UI** — Framer Motion page transitions, stagger animations, micro-interactions
- **REST API** — Full integration between Next.js frontend and ASP.NET Core backend

## Running the App

### 1. Backend — ASP.NET Core API (port 5000)

> Requires [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

```bash
dotnet run
# API available at http://localhost:5000/api/vehicles
```

### 2. Frontend — Next.js (port 3000)

```bash
cd ui
npm install
npm run dev
# Open http://localhost:3000
```

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin@2024` |
| Customer | `customer` | `cust@2024` |

## Contact

- **Phone**: +94711451023
- **Email**: pkgmalinda@gmail.com
- **GitHub**: [MalindaGamage](https://github.com/MalindaGamage)
