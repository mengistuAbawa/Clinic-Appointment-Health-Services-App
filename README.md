# Clinic Appointment & Health Services

ClinicCare is a modern healthcare mobile app that helps patients find clinics, explore healthcare providers, check availability, book and manage appointments, save favorite doctors, receive notifications, view appointment history, and access clinic locations through a secure, user-friendly platform.

A TypeScript monorepo with an Expo Router patient app and an Express/Prisma API.

## Requirements

- Node.js 22.13 or newer (Expo SDK 58 requirement)
- npm 10 or newer
- PostgreSQL 15 or newer
- Expo development build for native maps and local notifications

## Setup

1. Install dependencies from the repository root: `npm install`.
2. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` to local values.
3. Copy `mobile/.env.example` to `mobile/.env`. Set `EXPO_PUBLIC_API_URL` to the backend origin reachable from your device. Use HTTPS outside local development. Android emulator example: `http://10.0.2.2:3000`.
4. Create the database and seed demo data:

   ```sh
   npm run backend:migrate -- --name init
   npm run backend:seed
   ```

5. Start the API and Expo development server with `npm run dev`, or use `npm run backend:dev` and `npm run mobile:start` separately.

The API listens on port 3000 by default. Swagger UI is at `http://localhost:3000/api/docs`.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Patient | patient@demo.com | Password123! |
| Admin | admin@demo.com | Admin123! |

## Android builds

Configure an EAS project with `cd mobile && npx eas-cli init`, set the `EXPO_PUBLIC_API_URL` and optional `GOOGLE_MAPS_API_KEY` EAS environment variables, then run:

```sh
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform android --profile production
```

See [docs/SETUP.md](docs/SETUP.md), [docs/API.md](docs/API.md), [docs/SCHEMA.md](docs/SCHEMA.md), [docs/TESTING.md](docs/TESTING.md), and [docs/REPORT_TEMPLATE.md](docs/REPORT_TEMPLATE.md).
