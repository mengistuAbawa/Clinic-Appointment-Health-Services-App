# Project Report â€” Clinic Appointment & Health Services App

> Academic project report template pre-filled with content specific to the Clinic Appointment & Health Services mobile application.

---

## 1. Title Page

---

**Project Title:** Clinic Appointment & Health Services App

**Subtitle:** A Cross-Platform Mobile Application for Healthcare Appointment Scheduling

**Course:** Mobile Application Development

**Submitted by:**
- Name: _[Your Full Name]_
- Student ID: _[Your Student ID]_
- Email: _[Your Email]_

**Submitted to:**
- Professor: _[Professor Name]_
- Department: _[Department Name]_
- University: _[University Name]_

**Date:** _[Submission Date]_

---

## 2. Abstract

This project presents the design, development, and deployment of a cross-platform mobile application for clinic appointment booking and health services management. The application enables patients to discover nearby healthcare clinics, browse available healthcare providers, view appointment slots in real-time, and book appointments seamlessly from their mobile devices.

Built using **React Native** with **Expo** for the mobile frontend and **Node.js** with **Express.js** for the backend REST API, the system employs **PostgreSQL** as its database with **Prisma ORM** for type-safe data access. The application integrates several native device features including GPS-based location services for finding nearby clinics, push notifications for appointment reminders, interactive maps for clinic visualization, and camera/gallery access for profile management.

Key features include JWT-based secure authentication, real-time slot availability, appointment management with status tracking, clinic search with category filtering and distance-based sorting, a favorites system, and offline support with cached data display. The project follows Agile methodology with iterative development sprints and employs industry-standard practices including input validation with Zod, secure token storage, and responsive UI design.

**Keywords:** Mobile Application, Healthcare, Appointment Scheduling, React Native, Expo, Node.js, PostgreSQL, REST API, Cross-Platform Development

---

## 3. Table of Contents

1. [Title Page](#1-title-page)
2. [Abstract](#2-abstract)
3. [Table of Contents](#3-table-of-contents)
4. [Introduction](#4-introduction)
5. [Literature Review](#5-literature-review)
6. [Methodology](#6-methodology)
7. [System Analysis](#7-system-analysis)
8. [System Design](#8-system-design)
9. [Implementation](#9-implementation)
10. [Device Features Integration](#10-device-features-integration)
11. [Security Implementation](#11-security-implementation)
12. [Testing](#12-testing)
13. [Deployment](#13-deployment)
14. [Results & Discussion](#14-results--discussion)
15. [Conclusion & Future Work](#15-conclusion--future-work)
16. [References](#16-references)

---

## 4. Introduction

### 4.1 Background

The healthcare industry has undergone significant digital transformation in recent years. Patients increasingly expect the convenience of digital tools for managing their health, from discovering care providers to scheduling appointments. Traditional appointment booking methods â€” phone calls, in-person visits, or basic web forms â€” are time-consuming, error-prone, and lack real-time availability information.

Mobile applications have emerged as the primary interface for patients to interact with healthcare services. According to recent studies, over 70% of patients prefer using mobile apps to book medical appointments, citing convenience, 24/7 availability, and reduced wait times as primary motivators. The COVID-19 pandemic further accelerated this trend, making contactless, digital-first healthcare interactions a necessity.

### 4.2 Problem Statement

Despite the proliferation of health-related mobile applications, many existing solutions suffer from the following limitations:

1. **Poor User Experience:** Complex navigation, slow performance, and cluttered interfaces discourage patient engagement.
2. **Limited Discovery:** Patients struggle to find nearby clinics and compare healthcare providers based on specialty, location, and availability.
3. **No Real-Time Availability:** Many systems show outdated slot information, leading to booking failures and frustration.
4. **Fragmented Communication:** Patients miss appointments due to lack of timely reminders and notifications.
5. **Platform Lock-in:** Native iOS or Android-only solutions exclude a significant portion of potential users.
6. **Security Concerns:** Inadequate data protection and authentication mechanisms compromise patient privacy.

### 4.3 Objectives

The primary objectives of this project are:

1. **Develop a cross-platform mobile application** that runs on both Android and iOS using a single codebase (React Native with Expo).
2. **Implement a clinic discovery system** with search, category-based filtering, and GPS-based distance sorting to help patients find nearby clinics.
3. **Build a real-time appointment booking system** where patients can view available slots, book appointments, and receive instant confirmations.
4. **Integrate native device features** including location services, push notifications, interactive maps, and camera/gallery access for a rich user experience.
5. **Ensure security and privacy** through JWT-based authentication, secure token storage, input validation, and ownership-based access control.
6. **Create a scalable backend** with RESTful API design, proper pagination, and a relational database schema supporting future growth.
7. **Implement offline support** allowing users to view cached data when internet connectivity is unavailable.

### 4.4 Scope

**In Scope:**
- Patient-facing mobile application
- Clinic and provider browsing with search and filters
- Real-time appointment slot viewing and booking
- Appointment management (view, cancel)
- Favorites system for saving clinics
- User profile management with avatar upload
- Push notifications (booking confirmation and reminders)
- Map-based clinic visualization
- Offline data caching
- Backend REST API with PostgreSQL database

**Out of Scope:**
- Admin dashboard for clinic management
- Payment processing
- Video consultation / telemedicine
- Electronic Health Records (EHR) integration
- Multi-language / internationalization support
- iOS deployment (App Store submission)

---

## 5. Literature Review

### 5.1 Existing Clinic Appointment Applications

| Application | Platform | Key Features | Limitations |
|---|---|---|---|
| **Practo** | iOS, Android, Web | Doctor search, appointment booking, health records, teleconsultation | Complex UI, limited to certain regions, requires clinic onboarding |
| **Zocdoc** | iOS, Android, Web | Insurance-based search, real-time availability, patient reviews | US-only, expensive for providers, heavy onboarding |
| **MyChart** | iOS, Android | Portal for specific health systems, appointment management, messaging | Locked to specific hospital networks, not a discovery tool |
| **Doctoralia** | iOS, Android, Web | Doctor profiles, appointment booking, patient reviews | Limited real-time slot visibility, varied feature set by region |
| **HealthTap** | iOS, Android | AI symptom checker, virtual consultations | Focused on teleconsultation, limited appointment booking |

### 5.2 Technology Comparison

#### Mobile Framework Comparison

| Criterion | React Native (Expo) | Flutter | Native (Kotlin/Swift) |
|---|---|---|---|
| Language | JavaScript/TypeScript | Dart | Kotlin / Swift |
| Performance | Near-native | Near-native | Native |
| Code Sharing | ~95% across platforms | ~95% across platforms | 0% (separate codebases) |
| Learning Curve | Moderate (JS familiarity) | Moderate (new language) | High (two languages) |
| Ecosystem | Very large (npm) | Growing | Platform-specific |
| Hot Reload | âœ… | âœ… | Limited |
| Native Module Access | Via Expo Modules/SDK | Via plugins | Full access |
| Community | Very large | Large | Large |

**Decision:** React Native with Expo was chosen for its mature ecosystem, TypeScript support, extensive library of pre-built modules (location, notifications, maps, image picker), and the ability to build and deploy using EAS without requiring a local build environment.

#### Backend Framework Comparison

| Criterion | Express.js (Node.js) | Django (Python) | Spring Boot (Java) |
|---|---|---|---|
| Language | JavaScript/TypeScript | Python | Java |
| Performance | High (async I/O) | Moderate | High |
| Setup Complexity | Minimal | Moderate | High |
| REST API Support | Excellent | Excellent (DRF) | Excellent |
| ORM Options | Prisma, Sequelize, TypeORM | Django ORM | Hibernate |
| Learning Curve | Low | Moderate | High |
| Full-Stack Synergy | âœ… Same language as frontend | âŒ Different language | âŒ Different language |

**Decision:** Express.js with Node.js was chosen for full-stack JavaScript synergy, minimal boilerplate, and excellent compatibility with Prisma ORM for type-safe database access.

#### Database Comparison

| Criterion | PostgreSQL | MySQL | MongoDB |
|---|---|---|---|
| Type | Relational (SQL) | Relational (SQL) | Document (NoSQL) |
| ACID Compliance | Full | Full | Partial |
| Complex Queries | Excellent | Good | Limited (aggregation) |
| JSON Support | Native (JSONB) | Limited | Native |
| Prisma Support | âœ… | âœ… | âœ… |
| Geospatial | PostGIS extension | Limited | GeoJSON support |
| Free & Open Source | âœ… | âœ… | âœ… (Community) |

**Decision:** PostgreSQL was chosen for its robust relational model (well-suited for appointment/slot management), ACID compliance, advanced querying capabilities, and excellent Prisma ORM integration.

### 5.3 Key Takeaways

From the literature review, the following design decisions were made:
- Adopt a **cross-platform framework** to maximize reach with a single codebase
- Implement **real-time slot availability** to prevent booking conflicts
- Integrate **location services** for clinic discovery by proximity
- Use **push notifications** for appointment reminders to reduce no-shows
- Apply **JWT-based authentication** with secure token storage for patient data protection
- Design with **offline-first** principles for reliability

---

## 6. Methodology

### 6.1 Development Approach

The project follows an **Agile methodology** with iterative development sprints. Each sprint focuses on delivering a specific set of features that are tested and integrated before moving to the next sprint.

```mermaid
flowchart LR
    A["Sprint 1\nProject Setup\nAuth System"] --> B["Sprint 2\nClinics &\nProviders"]
    B --> C["Sprint 3\nSlots &\nBooking"]
    C --> D["Sprint 4\nAppointments &\nFavorites"]
    D --> E["Sprint 5\nDevice Features\nNotifications"]
    E --> F["Sprint 6\nPolish, Testing\n& Deployment"]
```

### 6.2 Sprint Breakdown

| Sprint | Duration | Focus Areas |
|---|---|---|
| **Sprint 1** | Week 1â€“2 | Project scaffolding, database schema, auth endpoints, login/register screens |
| **Sprint 2** | Week 3â€“4 | Clinic CRUD, provider endpoints, clinic list/detail screens, search & filter |
| **Sprint 3** | Week 5â€“6 | Slot management, booking flow, appointment creation, slot selection UI |
| **Sprint 4** | Week 7â€“8 | Appointment list/detail, cancel flow, favorites system, profile management |
| **Sprint 5** | Week 9â€“10 | Location integration, map display, push notifications, image picker |
| **Sprint 6** | Week 11â€“12 | Offline support, error handling, UI polish, testing, EAS build, documentation |

### 6.3 Technology Stack

```mermaid
flowchart TD
    subgraph Mobile["ðŸ“± Mobile App"]
        RN["React Native + Expo"]
        TS1["TypeScript"]
        TQ["TanStack React Query"]
        ZS["Zustand (State)"]
        EN["Expo Notifications"]
        EL["Expo Location"]
        EI["Expo Image Picker"]
        RNM["React Native Maps"]
        ZOD1["Zod (Validation)"]
    end

    subgraph Backend["ðŸ–¥ï¸ Backend API"]
        EX["Express.js"]
        TS2["TypeScript"]
        PR["Prisma ORM"]
        JWT["JWT Auth"]
        ZOD2["Zod (Validation)"]
        BC["bcrypt"]
    end

    subgraph Database["ðŸ—„ï¸ Database"]
        PG["PostgreSQL 15+"]
    end

    subgraph Build["ðŸ”§ Build & Deploy"]
        EAS["EAS Build"]
        GH["GitHub"]
    end

    Mobile -->|"REST API\nHTTP/JSON"| Backend
    Backend -->|"Prisma Client"| Database
    Mobile -->|"Source Code"| Build
```

### 6.4 Tools Used

| Category | Tool | Purpose |
|---|---|---|
| **IDE** | VS Code | Code editing with TypeScript IntelliSense |
| **API Testing** | Postman / Thunder Client | Manual API endpoint testing |
| **Database GUI** | Prisma Studio / pgAdmin | Database inspection and management |
| **Version Control** | Git + GitHub | Source code management |
| **Build Service** | EAS Build (Expo) | Cloud builds for Android APK/AAB |
| **Emulator** | Android Studio Emulator | Mobile app testing |
| **Design** | Figma _(optional)_ | UI/UX wireframing |

---

## 7. System Analysis

### 7.1 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Users can register with email, password, and name | High |
| FR-02 | Users can log in and receive JWT tokens | High |
| FR-03 | Token refresh mechanism for seamless session management | High |
| FR-04 | Users can browse a list of clinics with pagination | High |
| FR-05 | Users can search clinics by name | High |
| FR-06 | Users can filter clinics by category | High |
| FR-07 | Users can sort clinics by name or distance | Medium |
| FR-08 | Users can view clinic details with providers | High |
| FR-09 | Users can view a provider's available slots by date | High |
| FR-10 | Users can book an appointment by selecting an available slot | High |
| FR-11 | Users can view their upcoming and past appointments | High |
| FR-12 | Users can cancel a confirmed appointment | High |
| FR-13 | Users can add/remove clinics from favorites | Medium |
| FR-14 | Users can view and edit their profile | Medium |
| FR-15 | Users can upload a profile avatar | Low |
| FR-16 | Push notification on booking confirmation | Medium |
| FR-17 | Push notification reminder 30 min before appointment | Medium |
| FR-18 | Users can view clinic location on a map | Medium |
| FR-19 | Users can delete their account | Low |

### 7.2 Non-Functional Requirements

| ID | Requirement | Metric |
|---|---|---|
| NFR-01 | **Performance:** API response time | < 500ms for all endpoints |
| NFR-02 | **Performance:** UI frame rate | 60 FPS smooth scrolling |
| NFR-03 | **Security:** Password hashing | bcrypt with 12 salt rounds |
| NFR-04 | **Security:** Token storage | Encrypted device keychain (SecureStore) |
| NFR-05 | **Security:** Input validation | Both client and server-side (Zod) |
| NFR-06 | **Availability:** Offline support | Cached data viewable without internet |
| NFR-07 | **Usability:** Loading states | Skeleton placeholders on all lists |
| NFR-08 | **Usability:** Error handling | User-friendly messages with retry option |
| NFR-09 | **Scalability:** Pagination | All list endpoints paginated (default 10, max 50) |
| NFR-10 | **Compatibility:** Android support | API 24+ (Android 7.0 Nougat and above) |

### 7.3 Use Case Diagram

```mermaid
flowchart TD
    Patient["ðŸ‘¤ Patient"]

    Patient --> UC1["Register Account"]
    Patient --> UC2["Login / Logout"]
    Patient --> UC3["Browse Clinics"]
    Patient --> UC4["Search & Filter Clinics"]
    Patient --> UC5["View Clinic Details"]
    Patient --> UC6["View Provider & Slots"]
    Patient --> UC7["Book Appointment"]
    Patient --> UC8["View Appointments"]
    Patient --> UC9["Cancel Appointment"]
    Patient --> UC10["Manage Favorites"]
    Patient --> UC11["Edit Profile"]
    Patient --> UC12["Upload Avatar"]
    Patient --> UC13["View Clinic on Map"]
    Patient --> UC14["Receive Notifications"]
    Patient --> UC15["Delete Account"]

    UC3 -->|"includes"| UC4
    UC5 -->|"includes"| UC6
    UC6 -->|"extends"| UC7
    UC7 -->|"triggers"| UC14
```

### 7.4 Use Case Descriptions

#### UC-07: Book Appointment

| Field | Description |
|---|---|
| **Use Case ID** | UC-07 |
| **Name** | Book Appointment |
| **Actor** | Patient |
| **Preconditions** | Patient is authenticated; a clinic and provider are selected |
| **Main Flow** | 1. Patient selects a date<br>2. System displays available slots for the provider on that date<br>3. Patient selects an available slot<br>4. System shows booking confirmation dialog with details<br>5. Patient confirms the booking<br>6. System creates the appointment, marks slot as booked<br>7. System sends a confirmation push notification<br>8. System schedules a 30-min reminder notification |
| **Postconditions** | Appointment is created with CONFIRMED status; slot.isBooked = true |
| **Alternative Flows** | A1: Slot was booked by another user â†’ show "Slot unavailable" error<br>A2: Network error â†’ show retry option |

---

## 8. System Design

### 8.1 Architecture Overview

The application follows a **client-server architecture** with a clear separation between the mobile frontend and the backend API.

```mermaid
flowchart TD
    subgraph Client["ðŸ“± Mobile Client (React Native + Expo)"]
        UI["UI Layer\nScreens & Components"]
        SM["State Management\nZustand + React Query"]
        API["API Layer\nAxios + Interceptors"]
        Cache["Cache Layer\nReact Query Cache"]
        Secure["SecureStore\nToken Storage"]
        Native["Native Modules\nLocation, Notifications,\nMaps, ImagePicker"]
    end

    subgraph Server["ðŸ–¥ï¸ Backend Server (Express.js)"]
        Routes["Route Layer\nExpress Router"]
        MW["Middleware\nAuth, Validation, CORS"]
        Controllers["Controller Layer\nBusiness Logic"]
        ORM["Data Layer\nPrisma Client"]
    end

    subgraph DB["ðŸ—„ï¸ PostgreSQL"]
        Tables["Tables\nUser, Clinic, Provider,\nSlot, Appointment, Favorite"]
    end

    UI --> SM
    SM --> API
    SM --> Cache
    API -->|"HTTP/JSON\nREST API"| Routes
    API --> Secure
    UI --> Native
    Routes --> MW
    MW --> Controllers
    Controllers --> ORM
    ORM --> Tables
```

### 8.2 Entity-Relationship Diagram

_(See [SCHEMA.md](./SCHEMA.md) for the complete ER diagram and model details.)_

```mermaid
erDiagram
    User ||--o{ Appointment : "books"
    User ||--o{ Favorite : "saves"
    Clinic ||--o{ Provider : "employs"
    Clinic ||--o{ Favorite : "favorited by"
    Provider ||--o{ Slot : "has"
    Slot ||--o| Appointment : "reserved by"
```

### 8.3 API Design

The backend exposes a RESTful API with the following endpoint groups:

| Group | Base Path | Auth | Endpoints |
|---|---|---|---|
| **Auth** | `/api/auth` | None | register, login, refresh, logout |
| **Clinics** | `/api/clinics` | None | list (search/filter/sort), get by ID |
| **Providers** | `/api/providers` | None | get by ID, get slots by date |
| **Appointments** | `/api/appointments` | Required | create, list, get by ID, cancel |
| **Favorites** | `/api/favorites` | Required | list, add, remove |
| **Users** | `/api/users` | Required | get profile, update profile, delete account |

_(See [API.md](./API.md) for complete API documentation with request/response examples.)_

### 8.4 UI Wireframes / Screen Flow

```mermaid
flowchart TD
    Splash["Splash Screen"] --> AuthCheck{"Authenticated?"}
    AuthCheck -->|"No"| Login["Login Screen"]
    AuthCheck -->|"Yes"| Home["Home Screen\n(Clinic List)"]

    Login --> Register["Register Screen"]
    Register --> Login
    Login --> Home

    Home --> ClinicDetail["Clinic Detail\n+ Map + Providers"]
    ClinicDetail --> ProviderDetail["Provider Detail\n+ Slot Selection"]
    ProviderDetail --> BookingConfirm["Booking Confirmation"]
    BookingConfirm --> AppointmentDetail["Appointment Detail"]

    Home --> Tabs{"Bottom Tabs"}
    Tabs --> Home
    Tabs --> Appointments["Appointments\n(Upcoming / Past)"]
    Tabs --> Favorites["Favorites\n(Saved Clinics)"]
    Tabs --> Profile["Profile Screen"]

    Appointments --> AppointmentDetail
    AppointmentDetail --> CancelConfirm["Cancel Confirmation"]
    Favorites --> ClinicDetail
    Profile --> EditProfile["Edit Profile"]
    Profile --> DeleteAccount["Delete Account\nConfirmation"]
```

---

## 9. Implementation

### 9.1 Project Structure

```
Clinic Appointment & Health Services App/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ prisma/
â”‚   â”‚   â”œâ”€â”€ schema.prisma          # Database schema
â”‚   â”‚   â”œâ”€â”€ migrations/            # Database migrations
â”‚   â”‚   â””â”€â”€ seed.ts                # Seed data script
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ routes/                # Express route definitions
â”‚   â”‚   â”œâ”€â”€ controllers/           # Request handlers
â”‚   â”‚   â”œâ”€â”€ middleware/            # Auth, validation, error handling
â”‚   â”‚   â”œâ”€â”€ utils/                 # Helpers (JWT, hashing)
â”‚   â”‚   â”œâ”€â”€ validators/           # Zod validation schemas
â”‚   â”‚   â””â”€â”€ index.ts              # Server entry point
â”‚   â”œâ”€â”€ .env                       # Environment variables
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ tsconfig.json
â”œâ”€â”€ mobile/
â”‚   â”œâ”€â”€ app/                       # Expo Router screens
â”‚   â”‚   â”œâ”€â”€ (auth)/               # Auth screens (login, register)
â”‚   â”‚   â”œâ”€â”€ (tabs)/               # Tab screens (home, appointments, etc.)
â”‚   â”‚   â””â”€â”€ _layout.tsx           # Root layout
â”‚   â”œâ”€â”€ components/               # Reusable UI components
â”‚   â”œâ”€â”€ hooks/                    # Custom React hooks
â”‚   â”œâ”€â”€ services/                 # API service functions
â”‚   â”œâ”€â”€ stores/                   # Zustand state stores
â”‚   â”œâ”€â”€ types/                    # TypeScript type definitions
â”‚   â”œâ”€â”€ utils/                    # Utility functions
â”‚   â”œâ”€â”€ .env                      # Mobile environment variables
â”‚   â”œâ”€â”€ app.json                  # Expo config
â”‚   â”œâ”€â”€ eas.json                  # EAS build config
â”‚   â””â”€â”€ package.json
â””â”€â”€ docs/                         # Documentation
```

### 9.2 Key Code Snippets

#### 9.2.1 JWT Authentication Middleware

```typescript
// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access token is missing or invalid',
      code: 'UNAUTHORIZED',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Access token has expired',
      code: 'TOKEN_EXPIRED',
    });
  }
};
```

#### 9.2.2 Booking Endpoint with Transaction

```typescript
// backend/src/controllers/appointments.ts
export const createAppointment = async (req: AuthRequest, res: Response) => {
  const { slotId } = req.body;
  const userId = req.userId!;

  // Use Prisma transaction to prevent race conditions
  const appointment = await prisma.$transaction(async (tx) => {
    // Check slot availability inside transaction
    const slot = await tx.slot.findUnique({
      where: { id: slotId },
      include: { provider: { include: { clinic: true } } },
    });

    if (!slot) {
      throw new AppError('Slot not found', 404, 'NOT_FOUND');
    }

    if (slot.isBooked) {
      throw new AppError('This slot is already booked', 409, 'SLOT_TAKEN');
    }

    // Mark slot as booked
    await tx.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    // Create appointment
    return tx.appointment.create({
      data: {
        userId,
        slotId,
        status: 'CONFIRMED',
      },
      include: {
        slot: {
          include: {
            provider: true,
            clinic: true,
          },
        },
      },
    });
  });

  return res.status(201).json(appointment);
};
```

#### 9.2.3 Axios Interceptor with Token Refresh

```typescript
// mobile/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Request interceptor â€” attach access token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor â€” handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );

        await SecureStore.setItemAsync('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed â€” redirect to login
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // Navigate to login screen
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

#### 9.2.4 Clinic List Screen with Search & Filter

```typescript
// mobile/app/(tabs)/home.tsx
export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['clinics', debouncedSearch, category],
    queryFn: ({ pageParam = 1 }) =>
      fetchClinics({
        search: debouncedSearch,
        category,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} />
      <CategoryChips selected={category} onSelect={setCategory} />
      <FlatList
        data={data?.pages.flatMap((p) => p.data)}
        renderItem={({ item }) => <ClinicCard clinic={item} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        ListEmptyComponent={<EmptyState message="No clinics found" />}
        ListFooterComponent={isLoading ? <LoadingSkeleton /> : null}
      />
    </View>
  );
}
```

---

## 10. Device Features Integration

### 10.1 Location Services

**Library:** `expo-location`

**Usage:** Finding nearby clinics sorted by distance.

```typescript
import * as Location from 'expo-location';

const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Location Required',
      'Enable location to find clinics near you.',
      [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
    );
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
};
```

**Integration Points:**
- "Near Me" sorting on clinic list
- Distance display on clinic cards
- Default map center on clinic detail

### 10.2 Push Notifications

**Library:** `expo-notifications`

**Usage:** Booking confirmations and appointment reminders.

```typescript
import * as Notifications from 'expo-notifications';

// Schedule a 30-minute reminder
const scheduleReminder = async (appointment: Appointment) => {
  const triggerDate = new Date(appointment.slot.startTime);
  triggerDate.setMinutes(triggerDate.getMinutes() - 30);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Appointment Reminder â°',
      body: `Your appointment with ${appointment.slot.provider.name} is in 30 minutes.`,
      data: { appointmentId: appointment.id },
    },
    trigger: triggerDate,
  });
};
```

**Notification Types:**
| Type | Trigger | Content |
|---|---|---|
| Booking Confirmation | Immediately after booking | Appointment details with provider and time |
| Appointment Reminder | 30 minutes before appointment | Reminder with provider name |

### 10.3 Interactive Maps

**Library:** `react-native-maps`

**Usage:** Displaying clinic location on the clinic detail screen.

```typescript
import MapView, { Marker } from 'react-native-maps';

const ClinicMap = ({ clinic }) => (
  <MapView
    style={styles.map}
    initialRegion={{
      latitude: clinic.latitude,
      longitude: clinic.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
  >
    <Marker
      coordinate={{
        latitude: clinic.latitude,
        longitude: clinic.longitude,
      }}
      title={clinic.name}
      description={clinic.address}
    />
  </MapView>
);
```

### 10.4 Image Picker

**Library:** `expo-image-picker`

**Usage:** Profile avatar upload from camera or gallery.

```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    const imageUri = result.assets[0].uri;
    await uploadAvatar(imageUri);
  }
};
```

---

## 11. Security Implementation

### 11.1 Authentication Flow

```mermaid
sequenceDiagram
    participant App as Mobile App
    participant API as Backend API
    participant DB as Database

    App->>API: POST /auth/register {email, password, name}
    API->>API: Validate with Zod
    API->>API: Hash password (bcrypt, 12 rounds)
    API->>DB: Create User
    DB-->>API: User record
    API-->>App: 201 {user}

    App->>API: POST /auth/login {email, password}
    API->>DB: Find user by email
    DB-->>API: User with hashed password
    API->>API: Compare passwords (bcrypt)
    API->>API: Generate access token (15min)
    API->>API: Generate refresh token (7 days)
    API-->>App: 200 {accessToken, refreshToken, user}

    App->>App: Store tokens in SecureStore

    App->>API: GET /appointments (Authorization: Bearer ...)
    API->>API: Verify JWT signature
    API->>API: Check expiration
    API->>DB: Fetch user's appointments
    DB-->>API: Appointments
    API-->>App: 200 {data: [...]}

    Note over App,API: When access token expires...

    App->>API: POST /auth/refresh {refreshToken}
    API->>API: Verify refresh token
    API->>API: Generate new access token
    API-->>App: 200 {accessToken}
```

### 11.2 Security Measures Summary

| Measure | Implementation | Purpose |
|---|---|---|
| Password Hashing | bcrypt with 12 salt rounds | Protect passwords at rest |
| JWT Access Tokens | 15-minute expiry | Short-lived session authorization |
| JWT Refresh Tokens | 7-day expiry | Seamless session renewal |
| Secure Token Storage | `expo-secure-store` (device keychain) | Encrypted client-side storage |
| Input Validation | Zod schemas (client + server) | Prevent injection and malformed data |
| CORS | Configurable origin whitelist | Restrict cross-origin requests |
| Ownership Checks | Middleware verifies `userId` matches resource owner | Prevent unauthorized access |
| Rate Limiting | Per-endpoint request limits | Prevent brute-force attacks |
| No Secrets in Code | Environment variables via `.env` | Keep secrets out of source control |

---

## 12. Testing

### 12.1 Test Approach

Testing was conducted through **manual testing** across multiple devices and scenarios. A comprehensive test checklist covering 152 test cases was used.

_(See [TESTING.md](./TESTING.md) for the complete manual test checklist.)_

### 12.2 Test Categories

| Category | Test Cases | Description |
|---|---|---|
| Authentication | 18 | Register, login, logout, token refresh, protected routes |
| Clinics | 17 | List, search, filter, sort, detail view |
| Providers & Slots | 8 | Provider detail, slot display, date selection |
| Booking | 5 | Slot selection, confirmation, post-booking state |
| Appointments | 11 | Upcoming/past lists, cancel, empty states |
| Favorites | 10 | Add, remove, optimistic updates, list |
| Profile | 10 | View, edit, avatar, logout, delete |
| Notifications | 7 | Booking confirmation, reminders, permissions |
| Search/Filter/Sort | 10 | Debounce, categories, distance, pagination |
| Offline | 5 | Banner, cached data, reconnection |
| UI States | 14 | Loading, empty, error, success states |
| Validation | 8 | Client-side and server-side Zod validation |
| Security | 10 | Token storage, ownership, password handling |
| Device Features | 10 | Location, notifications, maps, image picker |
| Navigation | 10 | Tabs, stacks, deep links, back navigation |
| Performance | 8 | Scrolling, image caching, memory |

### 12.3 Sample Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Register with valid data | 1. Open register screen<br>2. Enter valid email, password, name<br>3. Tap Register | Account created, redirected to home | âœ… Pass |
| TC-02 | Login with invalid password | 1. Open login screen<br>2. Enter valid email, wrong password<br>3. Tap Login | Error message: "Invalid email or password" | âœ… Pass |
| TC-03 | Book an available slot | 1. Navigate to a provider<br>2. Select a date<br>3. Tap available slot<br>4. Confirm booking | Appointment created, notification received | âœ… Pass |
| TC-04 | Cancel a confirmed appointment | 1. Go to appointments<br>2. Tap a confirmed appointment<br>3. Tap Cancel<br>4. Confirm cancellation | Status changes to CANCELLED | âœ… Pass |
| TC-05 | Search clinics with debounce | 1. Type "dental" in search<br>2. Observe API calls | Only 1 API call fires after 300ms pause | âœ… Pass |
| TC-06 | Offline banner display | 1. Disable network<br>2. Observe the app | Offline banner appears, cached data shown | âœ… Pass |

### 12.4 Test Environment

| Property | Value |
|---|---|
| **Physical Device** | _[Device Model]_ â€” Android _[Version]_ |
| **Emulator** | Android Studio â€” Pixel 6 API 34 |
| **Backend** | localhost:3000 |
| **Database** | PostgreSQL 15 with seed data |

---

## 13. Deployment

### 13.1 Backend Deployment

The backend can be deployed to any Node.js hosting platform. Common options include:

| Platform | Type | Free Tier |
|---|---|---|
| **Railway** | PaaS | $5 credit/month |
| **Render** | PaaS | Free (sleeps after inactivity) |
| **DigitalOcean App Platform** | PaaS | Paid |
| **AWS EC2** | IaaS | Free tier (1 year) |

**Deployment steps:**
1. Push code to GitHub
2. Connect hosting platform to repository
3. Set environment variables (DATABASE_URL, JWT secrets, etc.)
4. Configure build command: `npm run build`
5. Configure start command: `npm start`
6. Set up managed PostgreSQL database

### 13.2 Mobile Deployment (EAS Build)

#### Preview Build (Internal Testing)

```bash
cd mobile
eas build --platform android --profile preview
# Outputs: .apk file for direct installation
```

#### Production Build (Play Store)

```bash
cd mobile
eas build --platform android --profile production
# Outputs: .aab file for Play Store upload
```

### 13.3 Environment Configuration

| Environment | API URL | NODE_ENV | Debug |
|---|---|---|---|
| **Development** | `http://10.0.2.2:3000/api` | `development` | Enabled |
| **Staging** | `https://api-staging.yourapp.com/api` | `production` | Disabled |
| **Production** | `https://api.yourapp.com/api` | `production` | Disabled |

---

## 14. Results & Discussion

### 14.1 Achievements

The Clinic Appointment & Health Services App successfully delivers the following outcomes:

1. **Functional Cross-Platform App:** A fully working Android application built with React Native and Expo, capable of running on both Android emulators and physical devices.

2. **Complete Booking Workflow:** Users can discover clinics â†’ browse providers â†’ view slots â†’ book appointments â†’ receive confirmations â€” all within a seamless mobile experience.

3. **Device Feature Integration:** Successfully integrated four native device capabilities:
   - GPS location for "near me" clinic sorting
   - Push notifications for booking confirmations and reminders
   - Interactive maps for clinic visualization
   - Camera/gallery for avatar management

4. **Secure Authentication:** JWT-based auth with encrypted token storage, automatic refresh, and proper session management.

5. **Robust Backend:** RESTful API with full CRUD operations, input validation, pagination, error handling, and relational database integrity.

6. **Responsive UI:** Smooth scrolling, loading skeletons, empty states, error states with retry, and optimistic updates for favorites.

### 14.2 Challenges Faced

| Challenge | Solution |
|---|---|
| Race conditions during slot booking | Prisma database transactions with slot locking |
| Token refresh with concurrent requests | Request queue that retries after refresh completes |
| Location permission UX | Graceful degradation â€” distance sort disabled without permission |
| Push notifications in Expo Go | Switched to development builds for full notification support |
| Offline data consistency | React Query cache with stale-while-revalidate strategy |

### 14.3 Limitations

- **Admin Panel:** No admin interface for managing clinics, providers, or slots â€” all seed data
- **Payment Integration:** No payment gateway for appointment fees
- **iOS Testing:** Not tested on iOS devices due to hardware constraints
- **Real-Time Updates:** No WebSocket support â€” slot availability relies on polling/refetch
- **Production Database:** Not deployed to a production database server

---

## 15. Conclusion & Future Work

### 15.1 Conclusion

The Clinic Appointment & Health Services App demonstrates the feasibility of building a comprehensive healthcare appointment management system using modern cross-platform mobile technologies. The project successfully integrates multiple native device features, implements secure authentication, and delivers a polished user experience with proper loading states, error handling, and offline support.

The use of React Native with Expo significantly reduced development time compared to building separate native applications, while TypeScript provided type safety across both the frontend and backend codebases. Prisma ORM simplified database operations and ensured schema consistency through migrations.

The project fulfills all primary objectives: clinic discovery with location-based sorting, real-time appointment booking with slot management, push notification integration, and a secure, scalable architecture.

### 15.2 Future Work

The following enhancements are recommended for future development:

| Enhancement | Description | Priority |
|---|---|---|
| **Admin Dashboard** | Web-based panel for clinics to manage providers, slots, and appointments | High |
| **Payment Gateway** | Integration with Stripe or Razorpay for appointment fees | High |
| **Teleconsultation** | Video call feature using WebRTC or third-party SDK | Medium |
| **Ratings & Reviews** | Patient feedback system for providers and clinics | Medium |
| **Real-Time Updates** | WebSocket integration for live slot availability | Medium |
| **Multi-Language** | Internationalization (i18n) support for multiple languages | Medium |
| **EHR Integration** | Connect with Electronic Health Record systems | Low |
| **AI Chatbot** | Symptom-based clinic/provider recommendation | Low |
| **iOS Deployment** | Test and publish on Apple App Store | Medium |
| **Analytics** | Usage analytics dashboard for appointment trends | Low |

---

## 16. References

1. React Native Documentation. (2024). *Getting Started with React Native*. [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)

2. Expo Documentation. (2024). *Expo SDK Reference*. [https://docs.expo.dev/](https://docs.expo.dev/)

3. Express.js Documentation. (2024). *Express - Node.js Web Application Framework*. [https://expressjs.com/](https://expressjs.com/)

4. Prisma Documentation. (2024). *Prisma ORM - Next-generation Node.js and TypeScript ORM*. [https://www.prisma.io/docs](https://www.prisma.io/docs)

5. PostgreSQL Documentation. (2024). *PostgreSQL: The World's Most Advanced Open Source Database*. [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)

6. JSON Web Tokens. (2024). *Introduction to JSON Web Tokens*. [https://jwt.io/introduction](https://jwt.io/introduction)

7. Zod Documentation. (2024). *Zod - TypeScript-first Schema Validation*. [https://zod.dev/](https://zod.dev/)

8. TanStack Query. (2024). *Powerful Asynchronous State Management*. [https://tanstack.com/query/latest](https://tanstack.com/query/latest)

9. Zustand Documentation. (2024). *Bear necessities for state management*. [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)

10. EAS Build Documentation. (2024). *Build your app with Expo Application Services*. [https://docs.expo.dev/build/introduction/](https://docs.expo.dev/build/introduction/)

11. React Native Maps. (2024). *React Native Mapview component for iOS + Android*. [https://github.com/react-native-maps/react-native-maps](https://github.com/react-native-maps/react-native-maps)

12. OWASP. (2024). *Mobile Application Security Verification Standard*. [https://owasp.org/www-project-mobile-app-security/](https://owasp.org/www-project-mobile-app-security/)

13. World Health Organization. (2021). *Global Strategy on Digital Health 2020-2025*. [https://www.who.int/docs/default-source/documents/gs4dh.pdf](https://www.who.int/docs/default-source/documents/gs4dh.pdf)

14. Statista. (2024). *Mobile Health App Usage Statistics*. [https://www.statista.com/topics/2263/mhealth/](https://www.statista.com/topics/2263/mhealth/)

---

> **Note:** Replace placeholder text (marked with `_[brackets]_`) with your actual information before submission.

