/**
 * src/config/swagger.ts
 * Swagger / OpenAPI configuration using swagger-jsdoc.
 */

import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinic Appointment & Health Services API",
      version: "1.0.0",
      description:
        "RESTful API for managing clinic appointments, providers, and health services.",
      contact: {
        name: "API Support",
        email: "support@clinic-app.com",
      },
    },
    paths: {
      "/api/auth/register": { post: { summary: "Register a patient", tags: ["Authentication"], requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password", "name"], properties: { email: { type: "string", format: "email" }, password: { type: "string", minLength: 8 }, name: { type: "string" }, phone: { type: "string" } } } } } }, responses: { "201": { description: "Patient account created" }, "400": { description: "Validation error" }, "409": { description: "Email is already registered" } } } },
      "/api/auth/login": { post: { summary: "Sign in", tags: ["Authentication"], requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email" }, password: { type: "string" } } } } } }, responses: { "200": { description: "Access and refresh tokens with the public user" }, "401": { description: "Credentials are invalid" } } } },
      "/api/auth/refresh": { post: { summary: "Rotate refresh token", tags: ["Authentication"], requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["refreshToken"], properties: { refreshToken: { type: "string" } } } } } }, responses: { "200": { description: "New access and refresh tokens" }, "401": { description: "Refresh token is invalid or already used" } } } },
      "/api/auth/logout": { post: { summary: "Revoke refresh token", tags: ["Authentication"], security: [{ BearerAuth: [] }], responses: { "200": { description: "Session revoked" }, "401": { description: "Authentication required" } } } },
      "/api/clinics": { get: { summary: "Search and paginate clinics", tags: ["Clinics"], parameters: [{ in: "query", name: "search", schema: { type: "string" } }, { in: "query", name: "category", schema: { type: "string" } }, { in: "query", name: "page", schema: { type: "integer", minimum: 1 } }, { in: "query", name: "limit", schema: { type: "integer", minimum: 1, maximum: 50 } }, { in: "query", name: "sort", schema: { type: "string", enum: ["name", "createdAt", "distance"] } }, { in: "query", name: "lat", schema: { type: "number", minimum: -90, maximum: 90 } }, { in: "query", name: "lng", schema: { type: "number", minimum: -180, maximum: 180 } }], responses: { "200": { description: "Paginated clinic results" }, "400": { description: "Invalid query" } } } },
      "/api/clinics/{id}": { get: { summary: "Get a clinic and its providers", tags: ["Clinics"], parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }], responses: { "200": { description: "Clinic details" }, "404": { description: "Clinic not found" } } } },
      "/api/providers/{id}": { get: { summary: "Get provider profile and availability", tags: ["Providers"], parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }], responses: { "200": { description: "Provider details" }, "404": { description: "Provider not found" } } } },
      "/api/providers/{id}/slots": { get: { summary: "List a provider's open slots for a date", tags: ["Providers"], parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }, { in: "query", name: "date", required: true, schema: { type: "string", format: "date" } }], responses: { "200": { description: "Available appointment slots" }, "400": { description: "Invalid date" }, "404": { description: "Provider not found" } } } },
      "/api/appointments": {
        get: { summary: "List the signed-in patient's appointments", tags: ["Appointments"], security: [{ BearerAuth: [] }], parameters: [{ in: "query", name: "status", schema: { type: "string", enum: ["upcoming", "past"] } }, { in: "query", name: "page", schema: { type: "integer", minimum: 1 } }, { in: "query", name: "limit", schema: { type: "integer", minimum: 1, maximum: 50 } }], responses: { "200": { description: "Paginated patient appointment history" }, "401": { description: "Authentication required" } } },
        post: { summary: "Book an available slot", tags: ["Appointments"], security: [{ BearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["slotId"], properties: { slotId: { type: "string" }, notes: { type: "string", maxLength: 500 } } } } } }, responses: { "201": { description: "Appointment confirmed" }, "400": { description: "Validation error" }, "409": { description: "Slot is no longer available" } } },
      },
      "/api/appointments/{id}": { get: { summary: "Get an owned appointment", tags: ["Appointments"], security: [{ BearerAuth: [] }], parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }], responses: { "200": { description: "Appointment detail" }, "404": { description: "Appointment not found" } } } },
      "/api/appointments/{id}/cancel": { patch: { summary: "Cancel an upcoming appointment", tags: ["Appointments"], security: [{ BearerAuth: [] }], parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }], responses: { "200": { description: "Appointment cancelled and slot released" }, "404": { description: "Appointment not found" }, "409": { description: "Appointment cannot be cancelled" } } } },
      "/api/favorites": { get: { summary: "List saved clinics", tags: ["Favorites"], security: [{ BearerAuth: [] }], responses: { "200": { description: "Favorite clinics for the signed-in patient" }, "401": { description: "Authentication required" } } } },
      "/api/favorites/{clinicId}": {
        post: { summary: "Save a clinic", tags: ["Favorites"], security: [{ BearerAuth: [] }], parameters: [{ in: "path", name: "clinicId", required: true, schema: { type: "string" } }], responses: { "201": { description: "Clinic saved" }, "404": { description: "Clinic not found" } } },
        delete: { summary: "Remove a saved clinic", tags: ["Favorites"], security: [{ BearerAuth: [] }], parameters: [{ in: "path", name: "clinicId", required: true, schema: { type: "string" } }], responses: { "200": { description: "Favorite removed" } } },
      },
      "/api/users/me": {
        get: { summary: "Get the signed-in profile", tags: ["Users"], security: [{ BearerAuth: [] }], responses: { "200": { description: "Public profile" }, "401": { description: "Authentication required" } } },
        put: { summary: "Update name, phone, or avatar", tags: ["Users"], security: [{ BearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, phone: { type: "string" }, avatarUrl: { type: "string" } } } } } }, responses: { "200": { description: "Updated profile" }, "400": { description: "Invalid profile data" } } },
        delete: { summary: "Soft-delete the signed-in account", tags: ["Users"], security: [{ BearerAuth: [] }], responses: { "200": { description: "Account deactivated" } } },
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            code: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            data: { type: "array", items: { type: "object" } },
            page: { type: "number" },
            limit: { type: "number" },
            total: { type: "number" },
            hasMore: { type: "boolean" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            phone: { type: "string", nullable: true },
            avatarUrl: { type: "string", nullable: true },
            role: { type: "string", enum: ["PATIENT", "ADMIN"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Clinic: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            address: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            phone: { type: "string" },
            imageUrl: { type: "string", nullable: true },
            category: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Provider: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            specialty: { type: "string" },
            bio: { type: "string" },
            imageUrl: { type: "string", nullable: true },
            clinicId: { type: "string" },
          },
        },
        Slot: {
          type: "object",
          properties: {
            id: { type: "string" },
            providerId: { type: "string" },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
            isBooked: { type: "boolean" },
          },
        },
        Appointment: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            providerId: { type: "string" },
            slotId: { type: "string" },
            status: {
              type: "string",
              enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
            },
            notes: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Favorite: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            clinicId: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
