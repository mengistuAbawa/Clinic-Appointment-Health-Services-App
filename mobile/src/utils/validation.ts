/** Client form schemas shared by login, registration, and profile forms. */
import { z } from "zod";
export const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(8).max(128) });
export const registerSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().max(30).optional(), password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/), confirmPassword: z.string().max(128) }).refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });
export const profileSchema = z.object({ name: z.string().trim().min(2).max(100), phone: z.string().trim().max(30).optional() });
export type LoginValues = z.infer<typeof loginSchema>; export type RegisterValues = z.infer<typeof registerSchema>;
