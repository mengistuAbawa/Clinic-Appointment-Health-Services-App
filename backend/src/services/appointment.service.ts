/** Atomic appointment booking, patient-scoped reads, and safe cancellation. */
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../lib/errors";
import { paginatedResponse } from "../utils/pagination";

const appointmentInclude = { provider: { include: { clinic: true } }, slot: true } satisfies Prisma.AppointmentInclude;

export async function bookAppointment(userId: string, slotId: string, notes?: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({ where: { id: slotId } });
      if (!slot || slot.isBooked || slot.startTime <= new Date()) {
        throw new ConflictError("This appointment slot is no longer available");
      }
      const reserved = await tx.slot.updateMany({ where: { id: slotId, isBooked: false }, data: { isBooked: true } });
      if (reserved.count !== 1) throw new ConflictError("This appointment slot was just booked");
      return tx.appointment.create({
        data: { userId, providerId: slot.providerId, slotId, notes: notes?.trim() || null },
        include: appointmentInclude,
      });
    });
  } catch (error) {
    if (error instanceof ConflictError) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictError("This appointment slot was just booked");
    }
    throw error;
  }
}

export async function listAppointments(userId: string, status: string | undefined, pageValue: number, limitValue: number) {
  if (status && status !== "upcoming" && status !== "past") {
    throw new BadRequestError("status must be upcoming or past");
  }
  const page = Math.max(1, pageValue || 1);
  const limit = Math.min(50, Math.max(1, limitValue || 10));
  const now = new Date();
  const where: Prisma.AppointmentWhereInput = {
    userId,
    ...(status === "upcoming"
      ? { status: "CONFIRMED", slot: { startTime: { gte: now } } }
      : status === "past"
        ? { OR: [{ status: { in: ["CANCELLED", "COMPLETED"] } }, { status: "CONFIRMED", slot: { startTime: { lt: now } } }] }
        : {}),
  };
  const [total, data] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({ where, include: appointmentInclude, orderBy: { slot: { startTime: status === "past" ? "desc" : "asc" } }, skip: (page - 1) * limit, take: limit }),
  ]);
  return paginatedResponse(data, total, page, limit);
}

export async function getAppointmentById(userId: string, appointmentId: string) {
  const appointment = await prisma.appointment.findFirst({ where: { id: appointmentId, userId }, include: appointmentInclude });
  if (!appointment) throw new NotFoundError("Appointment not found");
  return appointment;
}

export async function cancelAppointment(userId: string, appointmentId: string) {
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findFirst({
      where: { id: appointmentId, userId },
      include: { slot: true },
    });
    if (!appointment) throw new NotFoundError("Appointment not found");
    if (appointment.status !== "CONFIRMED" || appointment.slot.startTime <= now) {
      throw new ConflictError("Only upcoming confirmed appointments can be cancelled");
    }

    const changed = await tx.appointment.updateMany({
      where: { id: appointmentId, userId, status: "CONFIRMED" },
      data: { status: "CANCELLED" },
    });
    if (changed.count !== 1) throw new ConflictError("This appointment has already changed");
    await tx.slot.update({ where: { id: appointment.slotId }, data: { isBooked: false } });
    return tx.appointment.findUniqueOrThrow({ where: { id: appointmentId }, include: appointmentInclude });
  });
}
