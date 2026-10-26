# Database schema

The Prisma schema targets PostgreSQL. Prisma owns migrations; create and commit them with `npm run backend:migrate -- --name init` after configuring `backend/.env`.

```mermaid
erDiagram
  User ||--o{ Appointment : books
  User ||--o{ Favorite : saves
  Clinic ||--o{ Provider : employs
  Clinic ||--o{ Favorite : "saved by"
  Provider ||--o{ Slot : offers
  Provider ||--o{ Appointment : attends
  Slot ||--o| Appointment : reserves

  User {
    String id PK
    String email UK
    String passwordHash
    String name
    String phone
    String avatarUrl
    Role role
    String refreshToken
    DateTime createdAt
    DateTime deletedAt
  }
  Clinic {
    String id PK
    String name
    String address
    Float latitude
    Float longitude
    String phone
    String imageUrl
    String category
    DateTime createdAt
  }
  Provider {
    String id PK
    String name
    String specialty
    String bio
    String imageUrl
    String clinicId FK
  }
  Slot {
    String id PK
    String providerId FK
    DateTime startTime
    DateTime endTime
    Boolean isBooked
  }
  Appointment {
    String id PK
    String userId FK
    String providerId FK
    String slotId FK UK
    AppointmentStatus status
    String notes
    DateTime createdAt
  }
  Favorite {
    String id PK
    String userId FK
    String clinicId FK
    String userId_clinicId UK
  }
```

## Enums

- `Role`: `PATIENT`, `ADMIN`. New registrations are always patients.
- `AppointmentStatus`: `CONFIRMED`, `CANCELLED`, `COMPLETED`.

## Models and constraints

- **User** stores a bcrypt password hash, one unique normalized email, an optional phone and avatar, a role, and a single rotating refresh token. `deletedAt` supports account deactivation without deleting appointment history.
- **Clinic** stores its name, address, coordinates, phone, optional image URL, category, and creation time. Coordinates are used for near-me search.
- **Provider** belongs to one clinic and stores a specialty, biography, and optional image. Deleting a clinic cascades to its providers.
- **Slot** belongs to one provider. `isBooked` is changed in the same transaction as appointment creation or cancellation.
- **Appointment** belongs to a user, provider, and unique slot. User, provider, and slot foreign keys cascade on deletion. API reads and writes are scoped to the authenticated user.
- **Favorite** connects a user and clinic with a composite unique constraint on `(userId, clinicId)`. Both relations cascade on deletion.

All model IDs are Prisma `cuid()` strings. Timestamps are stored as PostgreSQL timestamps. Seed data creates 10 Addis Ababa clinics, 20 providers, 300 slots, and demo patient/admin accounts.
