# Fleet Management System

A full-stack web application for managing a logistics fleet. The system supports two user roles - **manager** and **driver** - with distinct capabilities for each.

**Live demo:** [isi-fleet-management.up.railway.app](https://isi-fleet-management.up.railway.app)

---

## Features

### Manager

- Manage employees (create, edit, dismiss)
- Manage vehicles (add, edit, withdraw from fleet, return to fleet)
- View vehicle assignment history
- Review AI-generated damage reports with reference and post-trip photos
- Manage incident status (resolve or withdraw vehicle from fleet)
- View full incident history per vehicle

### Driver

- View and take available vehicles
- Return vehicles to base by uploading a dashboard photo (mileage and fuel level auto-filled via AI OCR) and four vehicle photos
- Real-time dashboard OCR results via WebSocket

### AI Integration

- OpenAI GPT-4o - dashboard OCR (reads mileage and fuel level from a photo) and vehicle damage detection (compares base reference photos with post-trip photos)
- Damage reports are automatically created and sent to the manager via email

---

## Tech Stack

### Backend

- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- Redis + BullMQ - async job queues for AI processing
- SocketIO - real-time dashboard OCR result delivery
- JWT - authentication
- Multer - file upload handling

### Frontend

- React + TypeScript + Vite
- Tailwind CSS + FlyonUI
- SocketIO Client

### Integrations

- Cloudinary - image storage (base reference photos, dashboard photos, vehicle photos)
- OpenAI API - damage detection and dashboard OCR
- Resend - email notifications (damage alerts, password reset)

### Infrastructure

- Docker + Docker Compose
- Railway - production deployment (backend, frontend, PostgreSQL, Redis)
- GitHub Actions - CI/CD (separate pipelines for frontend and backend)

---

## Architecture

```mermaid
graph TD
    Frontend["Frontend\nReact + Vite"] <--> Backend["Backend API\nExpress + TS"]
    Backend --> PostgreSQL["PostgreSQL\n(Prisma)"]
    Backend --> Redis["Redis\n(BullMQ)"]
    Backend --> Cloudinary["Cloudinary\n(Image Store)"]
    Redis --> Workers["BullMQ Workers\n- Dashboard OCR\n- Damage Check"]
    Workers --> OpenAI["OpenAI GPT-4o\n(OCR + Damage)"]
    Workers --> Resend["Resend\n(Emails)"]
```

---

## Database Schema (ERD)

```mermaid
erDiagram
    users {
        Int id PK
        String login
        String first_name
        String last_name
        String email
        String password_hash
        String phone_number
        String role
        Boolean is_active
        Boolean is_employed
        DateTime created_at
    }

    vehicles {
        Int id PK
        String license_plate
        String brand
        String model
        Int year_of_manufacture
        Int current_mileage
        Int current_fuel_level
        String status
        DateTime created_at
    }

    vehicle_assignments {
        Int id PK
        Int vehicle_id FK
        Int driver_id FK
        DateTime start_time
        DateTime end_time
        Int start_mileage
        Int end_mileage
        Int start_fuel_level
        Int end_fuel_level
        String dashboard_image_url
        String status
    }

    vehicle_status_images {
        Int id PK
        Int vehicle_id FK
        String side
        String image_url
        DateTime updated_at
    }

    vehicle_incidents {
        Int id PK
        Int vehicle_id FK
        Int assignment_id FK
        String ai_description
        String status
        DateTime created_at
    }

    vehicle_incident_images {
        Int id PK
        Int incident_id FK
        String side
        String image_url
        String image_type
    }

    users ||--o{ vehicle_assignments : "drives"
    vehicles ||--o{ vehicle_assignments : "assigned to"
    vehicles ||--o{ vehicle_status_images : "has"
    vehicles ||--o{ vehicle_incidents : "has"
    vehicle_assignments ||--o{ vehicle_incidents : "caused"
    vehicle_incidents ||--o{ vehicle_incident_images : "has"
```

---

## Local Development

### Prerequisites

- Docker & Docker Compose
- Node.js 20+

### Setup

1. Clone the repository:

```bash
git clone https://github.com/GPrzyborowski/fleet-management-system.git
cd fleet-management-system
```

2. Configure environment variables:

```bash
cp backend/.env.example backend/.env
# Fill in the required values in backend/.env
```

3. Start the database and Redis:

```bash
docker compose up -d
```

4. Run backend migrations and seed:

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. Start the backend:

```bash
npm run dev
```

1. Start the frontend:

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `backend/.env` file based on `.env.example`:

```env
DATABASE_URL=postgresql://admin:admin@localhost:5432/fleet_db
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OPENAI_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TEMPLATE_PASSWORD_RESET=
DAMAGE_ALERT_EMAIL=
FRONTEND_URL=http://localhost:5173
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## CI/CD

Two separate GitHub Actions pipelines:

- Backend CI - runs ESLint and Vitest on every push and pull request. Requires a PostgreSQL service container for integration tests.
- Frontend CI - runs ESLint, Vitest, and coverage report on every push and pull request.

Railway is configured with **Wait for CI** - deployments to production only happen after all checks pass on the `main` branch.

---

## Default Credentials (seed)

| Login       | Password | Role    |
| ----------- | -------- | ------- |
| `admin`     | `admin`  | Manager |
| `anowak`    | `admin`  | Driver  |
| `jkowalski` | `admin`  | Driver  |

---

## License

MIT
