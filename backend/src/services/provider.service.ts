/** Provider profile and daily availability queries. */
import { prisma } from "../lib/prisma";
import { BadRequestError, NotFoundError } from "../lib/errors";

export async function getProviderById(id: string) {
  const provider = await prisma.provider.findUnique({
    where: { id },
    include: {
      clinic: true,
      slots: { where: { isBooked: false, startTime: { gte: new Date() } }, orderBy: { startTime: "asc" }, take: 20 },
    },
  });
  if (!provider) throw new NotFoundError("Provider not found");
  return provider;
}

export async function listProviderSlots(providerId: string, dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateValue) {
    throw new BadRequestError("Date must be a valid YYYY-MM-DD date");
  }
  const provider = await prisma.provider.findUnique({ where: { id: providerId }, select: { id: true } });
  if (!provider) throw new NotFoundError("Provider not found");

  const end = new Date(date);
  end.setUTCDate(end.getUTCDate() + 1);
  const now = new Date();
  const startsAt = date > now ? date : now;
  return prisma.slot.findMany({
    where: { providerId, isBooked: false, startTime: { gte: startsAt, lt: end } },
    orderBy: { startTime: "asc" },
  });
}
