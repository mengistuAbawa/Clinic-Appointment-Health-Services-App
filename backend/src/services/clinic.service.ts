/** Clinic search, database pagination, and distance-ordered discovery. */
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { BadRequestError, NotFoundError } from "../lib/errors";
import { haversineDistance } from "../utils/distance";
import { paginatedResponse } from "../utils/pagination";

export interface ClinicListInput {
  search?: string;
  category?: string;
  sort?: "distance" | "name" | "createdAt";
  lat?: number;
  lng?: number;
  page: number;
  limit: number;
}

const escapeLikePattern = (value: string): string => value.replace(/[\\%_]/g, "\\$&");

export async function listClinics(input: ClinicListInput) {
  const page = Math.max(1, input.page || 1);
  const limit = Math.min(50, Math.max(1, input.limit || 10));
  if (input.sort === "distance" && (input.lat === undefined || input.lng === undefined)) {
    throw new BadRequestError("lat and lng are required when sort=distance");
  }

  const where: Prisma.ClinicWhereInput = {
    ...(input.category ? { category: { equals: input.category.trim(), mode: "insensitive" } } : {}),
    ...(input.search?.trim() ? {
      OR: [
        { name: { contains: input.search.trim(), mode: "insensitive" } },
        { address: { contains: input.search.trim(), mode: "insensitive" } },
      ],
    } : {}),
  };
  const total = await prisma.clinic.count({ where });

  if (input.sort === "distance") {
    const latitude = input.lat!;
    const longitude = input.lng!;
    const offset = (page - 1) * limit;
    const category = input.category?.trim() || null;
    const search = input.search?.trim() || null;
    const ordered = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT id FROM clinics
      WHERE (${category}::text IS NULL OR category ILIKE ${category ? escapeLikePattern(category) : ""})
        AND (${search}::text IS NULL OR name ILIKE ${search ? `%${escapeLikePattern(search)}%` : ""} OR address ILIKE ${search ? `%${escapeLikePattern(search)}%` : ""})
      ORDER BY POWER(latitude - ${latitude}, 2) + POWER((longitude - ${longitude}) * COS(RADIANS(${latitude})), 2), id
      LIMIT ${limit} OFFSET ${offset}
    `);
    const ids = ordered.map((row) => row.id);
    const records = await prisma.clinic.findMany({ where: { id: { in: ids } }, include: { _count: { select: { providers: true } } } });
    const byId = new Map(records.map((clinic) => [clinic.id, clinic]));
    const data = ids.flatMap((id) => {
      const clinic = byId.get(id);
      return clinic ? [{ ...clinic, distanceKm: haversineDistance(latitude, longitude, clinic.latitude, clinic.longitude) }] : [];
    });
    return paginatedResponse(data, total, page, limit);
  }

  const data = await prisma.clinic.findMany({
    where,
    include: { _count: { select: { providers: true } } },
    orderBy: input.sort === "name" ? { name: "asc" } : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  return paginatedResponse(data, total, page, limit);
}

export async function getClinicById(id: string) {
  const clinic = await prisma.clinic.findUnique({
    where: { id },
    include: {
      providers: {
        orderBy: { name: "asc" },
        include: {
          slots: { where: { isBooked: false, startTime: { gte: new Date() } }, orderBy: { startTime: "asc" }, take: 5 },
        },
      },
    },
  });
  if (!clinic) throw new NotFoundError("Clinic not found");
  return clinic;
}
