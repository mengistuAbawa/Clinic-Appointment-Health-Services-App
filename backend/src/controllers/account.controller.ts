/** Authenticated favorites and soft-deleted patient profile endpoints. */
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";
import * as favoriteService from "../services/favorite.service";

export async function listFavorites(req: Request, res: Response): Promise<void> {
  res.json({ data: await favoriteService.listFavorites(req.user!.userId) });
}
export async function addFavorite(req: Request, res: Response): Promise<void> {
  const item = await favoriteService.addFavorite(req.user!.userId, req.params.clinicId);
  res.status(201).json(item);
}
export async function removeFavorite(req: Request, res: Response): Promise<void> {
  await favoriteService.removeFavorite(req.user!.userId, req.params.clinicId);
  res.status(200).json({ message: "Favorite removed" });
}
export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findFirst({ where: { id: req.user!.userId, deletedAt: null }, select: { id: true, email: true, name: true, phone: true, avatarUrl: true, role: true, createdAt: true } });
  if (!user) throw new NotFoundError("User not found"); res.json(user);
}
export async function updateMe(req: Request, res: Response): Promise<void> {
  const body = req.body as { name?: string; phone?: string; avatarUrl?: string };
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { ...body, ...(body.phone !== undefined ? { phone: body.phone.trim() || null } : {}) },
    select: { id: true, email: true, name: true, phone: true, avatarUrl: true, role: true, createdAt: true },
  });
  res.json(user);
}
export async function deleteMe(req: Request, res: Response): Promise<void> {
  await prisma.user.update({ where: { id: req.user!.userId }, data: { deletedAt: new Date(), refreshToken: null } }); res.status(200).json({ message: "Account deleted" });
}
