/** Patient-owned clinic favorite queries and idempotent mutations. */
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";

export async function listFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: { clinic: { include: { _count: { select: { providers: true } } } } },
    orderBy: { id: "desc" },
  });
}

export async function addFavorite(userId: string, clinicId: string) {
  const clinic = await prisma.clinic.findUnique({ where: { id: clinicId }, select: { id: true } });
  if (!clinic) throw new NotFoundError("Clinic not found");
  return prisma.favorite.upsert({
    where: { userId_clinicId: { userId, clinicId } },
    update: {},
    create: { userId, clinicId },
    include: { clinic: { include: { _count: { select: { providers: true } } } } },
  });
}

export async function removeFavorite(userId: string, clinicId: string): Promise<void> {
  await prisma.favorite.deleteMany({ where: { userId, clinicId } });
}
