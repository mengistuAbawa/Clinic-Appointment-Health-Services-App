/** HTTP handlers for patient-owned appointment booking and history. */
import { Request, Response } from "express";
import * as appointmentService from "../services/appointment.service";

export async function createAppointment(req: Request, res: Response): Promise<void> {
  const { slotId, notes } = req.body as { slotId: string; notes?: string };
  res.status(201).json(await appointmentService.bookAppointment(req.user!.userId, slotId, notes));
}

export async function listAppointments(req: Request, res: Response): Promise<void> {
  const { status, page, limit } = req.query as { status?: string; page?: string; limit?: string };
  res.json(await appointmentService.listAppointments(req.user!.userId, status, Number(page), Number(limit)));
}

export async function getAppointment(req: Request, res: Response): Promise<void> {
  res.json(await appointmentService.getAppointmentById(req.user!.userId, req.params.id));
}

export async function cancelAppointment(req: Request, res: Response): Promise<void> {
  res.json(await appointmentService.cancelAppointment(req.user!.userId, req.params.id));
}
