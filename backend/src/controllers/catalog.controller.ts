/** Thin HTTP handlers for public clinic and provider catalog routes. */
import { Request, Response } from "express";
import * as clinicService from "../services/clinic.service";
import * as providerService from "../services/provider.service";

export async function listClinics(req: Request, res: Response): Promise<void> {
  const query = req.query as Record<string, string | undefined>;
  const result = await clinicService.listClinics({
    search: query.search,
    category: query.category,
    sort: query.sort as "distance" | "name" | "createdAt" | undefined,
    lat: query.lat === undefined ? undefined : Number(query.lat),
    lng: query.lng === undefined ? undefined : Number(query.lng),
    page: Number(query.page),
    limit: Number(query.limit),
  });
  res.json(result);
}

export async function getClinic(req: Request, res: Response): Promise<void> {
  res.json(await clinicService.getClinicById(req.params.id));
}

export async function getProvider(req: Request, res: Response): Promise<void> {
  res.json(await providerService.getProviderById(req.params.id));
}

export async function getProviderSlots(req: Request, res: Response): Promise<void> {
  const query = req.query as { date: string };
  res.json({ data: await providerService.listProviderSlots(req.params.id, query.date) });
}
