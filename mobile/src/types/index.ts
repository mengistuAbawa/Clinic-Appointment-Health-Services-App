/** Shared mobile DTOs mirroring the REST API response shapes. */
export type Role = "PATIENT" | "ADMIN";
export type AppointmentStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED";
export interface User { id: string; email: string; name: string; phone?: string | null; avatarUrl?: string | null; role: Role; createdAt: string; }
export interface Clinic { id: string; name: string; address: string; latitude: number; longitude: number; phone: string; imageUrl?: string | null; category: string; distanceKm?: number; providers?: Provider[]; }
export interface Provider { id: string; name: string; specialty: string; bio: string; imageUrl?: string | null; clinicId: string; clinic?: Clinic; slots?: Slot[]; }
export interface Slot { id: string; providerId: string; startTime: string; endTime: string; isBooked: boolean; }
export interface Appointment { id: string; userId: string; providerId: string; slotId: string; status: AppointmentStatus; notes?: string | null; createdAt: string; provider: Provider; slot: Slot; }
export interface Favorite { id: string; userId: string; clinicId: string; clinic: Clinic; }
export interface Page<T> { data: T[]; page: number; limit: number; total: number; hasMore: boolean; }
export interface AuthResponse { accessToken: string; refreshToken: string; user: User; }
