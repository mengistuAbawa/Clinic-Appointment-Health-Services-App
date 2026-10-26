# Local setup and Android builds

## Prerequisites

- Node.js 22.13 or newer and npm 10 or newer
- PostgreSQL 15 or newer
- Android Studio and an Android emulator for local Android runs
- An Expo account for EAS cloud builds

## Install the monorepo

Run these commands from the repository root. npm workspaces install backend and mobile dependencies together.

```sh
npm install
```

## Configure PostgreSQL and the API

Create a local database, for example `clinic_app`, then copy `backend/.env.example` to `backend/.env`. Set a valid PostgreSQL URL and two distinct random secrets of at least 32 characters:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/clinic_app?schema=public
JWT_ACCESS_SECRET=<random-secret-at-least-32-characters>
JWT_REFRESH_SECRET=<a-different-random-secret-at-least-32-characters>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:8081,http://localhost:19006
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

Generate strong local secrets with Node:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Create the schema, generate Prisma Client, and load demo data:

```sh
npm run backend:migrate -- --name init
npm run backend:seed
```

The seed adds 10 clinics, 20 providers, 300 future slots, and the patient/admin demo accounts listed in the README. The first migration needs a reachable PostgreSQL database.

## Configure the mobile app

Copy `mobile/.env.example` to `mobile/.env` and set `EXPO_PUBLIC_API_URL` to the API origin without `/api`:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

Use `http://localhost:3000` for web or an iOS simulator, `10.0.2.2` for the Android emulator, or your computer's LAN address for a physical phone. Add that device origin to `CORS_ORIGINS` in `backend/.env`. The production backend rejects plain HTTP; deploy the API behind HTTPS before creating a production build.

Set `GOOGLE_MAPS_API_KEY` for the Android native map provider. The key belongs in a local environment file or an EAS environment variable, never in source control.

## Run locally

Start the API and Expo development server together:

```sh
npm run dev
```

Or use separate terminals:

```sh
npm run backend:dev
npm run mobile:start
```

Open the API docs at `http://localhost:3000/api/docs` and the health endpoint at `http://localhost:3000/health`.

## EAS Android builds

Install or invoke the EAS CLI, initialize the Expo project once, and configure `EXPO_PUBLIC_API_URL` plus `GOOGLE_MAPS_API_KEY` as EAS environment variables.

```sh
cd mobile
npx eas-cli init
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform android --profile production
```

The `preview` profile produces an installable APK. The `production` profile produces an Android App Bundle (AAB). See `mobile/eas.json` for the full build settings.

## Troubleshooting

- **Database connection errors:** confirm PostgreSQL is running and `DATABASE_URL` names the right host, port, user, and database.
- **Prisma client errors:** run `npm run generate --workspace=backend` after dependency or schema changes.
- **The phone cannot reach the API:** use a LAN address on a physical device, allow inbound port 3000 in the computer firewall, and include the Expo origin in `CORS_ORIGINS`.
- **Map is blank on Android:** add a valid Google Maps Android key to `GOOGLE_MAPS_API_KEY`, then rebuild the native app.
- **Notifications do not appear:** grant notification permission; reminder notifications are scheduled only when the appointment starts more than 30 minutes in the future.
- **HTTPS_REQUIRED in production:** configure TLS at the public API endpoint and ensure the reverse proxy forwards the original protocol.
