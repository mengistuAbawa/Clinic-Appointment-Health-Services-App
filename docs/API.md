# Clinic Appointment API

Base URL: `http://localhost:3000/api` in local development. OpenAPI UI: `/api/docs`.
Production deployments must use HTTPS. Protected requests send `Authorization: Bearer <accessToken>`.

## Authentication

| Method | Path | Auth | Request | Success |
|---|---|---|---|---|
| POST | `/auth/register` | No | `{ "email", "password", "name", "phone?" }` | `201` with tokens and public user |
| POST | `/auth/login` | No | `{ "email", "password" }` | `200` with tokens and public user |
| POST | `/auth/refresh` | No | `{ "refreshToken" }` | `200` with rotated access and refresh tokens |
| POST | `/auth/logout` | Yes | `{ "refreshToken?" }` | `200` |

Access tokens last 15 minutes; refresh tokens last 7 days by default. Refresh tokens rotate on use, and the old token is invalidated. The mobile app stores both tokens in Expo SecureStore only.

Example login response:

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "user": {
    "id": "cm...",
    "email": "patient@example.com",
    "name": "Jane Patient",
    "phone": null,
    "avatarUrl": null,
    "role": "PATIENT",
    "createdAt": "2026-10-22T10:00:00.000Z"
  }
}
```

Passwords must contain at least eight characters, including uppercase, lowercase, number, and one of `!@#$%^&*`. Registration always creates a `PATIENT`; clients cannot assign roles.

## Clinics and providers

| Method | Path | Query / result |
|---|---|---|
| GET | `/clinics` | `search`, `category`, `page`, `limit`, `sort=name\|createdAt\|distance`, `lat`, `lng` |
| GET | `/clinics/:id` | Clinic details with providers and each provider's next five open slots |
| GET | `/providers/:id` | Provider profile, clinic, and next 20 open slots |
| GET | `/providers/:id/slots?date=YYYY-MM-DD` | Open slots for that calendar date |

Clinic results use the pagination envelope below. `sort=distance` requires both valid `lat` and `lng`; result rows include `distanceKm`. Page size defaults to 10 and is capped at 50.

## Appointments

| Method | Path | Auth | Request / result |
|---|---|---|---|
| POST | `/appointments` | Yes | `{ "slotId": "...", "notes?": "..." }`; `201` with confirmed appointment |
| GET | `/appointments?status=upcoming\|past&page=1&limit=10` | Yes | Paginated appointments belonging to the signed-in user |
| GET | `/appointments/:id` | Yes | Appointment belonging to the signed-in user |
| PATCH | `/appointments/:id/cancel` | Yes | Cancels an upcoming confirmed appointment and releases its slot |

Booking reserves a slot and creates the appointment in one database transaction. A slot can only be attached to one appointment. Cancellation is limited to the appointment owner and future confirmed visits.

## Favorites and profile

| Method | Path | Auth | Request / result |
|---|---|---|---|
| GET | `/favorites` | Yes | `{ "data": Favorite[] }` for the signed-in user |
| POST | `/favorites/:clinicId` | Yes | Saves the clinic; repeated requests are safe |
| DELETE | `/favorites/:clinicId` | Yes | Removes the signed-in user's favorite |
| GET | `/users/me` | Yes | Public profile |
| PUT | `/users/me` | Yes | Any of `{ "name?", "phone?", "avatarUrl?" }` |
| DELETE | `/users/me` | Yes | Soft-deactivates the account and revokes refresh token |

`avatarUrl` accepts an HTTPS URL or a cropped JPEG, PNG, WebP, or HEIF data URL up to 900 KB. The API does not accept arbitrary file paths or non-HTTPS remote URLs.

## Common responses

Paginated lists return:

```json
{ "data": [], "page": 1, "limit": 10, "total": 0, "hasMore": false }
```

Errors return `{ "message": "...", "code": "...", "errors?": [] }`. Validation errors use `400`; missing or invalid authentication uses `401`; role denial uses `403`; missing resources use `404`; slot or uniqueness conflicts use `409`; rate limiting uses `429`; unexpected failures use `500`.

## Demo accounts

After `npm run backend:seed`:

| Role | Email | Password |
|---|---|---|
| Patient | `patient@demo.com` | `Password123!` |
| Admin | `admin@demo.com` | `Admin123!` |
