/** HTTP handlers for registration, login, refresh-token rotation, and logout. */
import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response): Promise<void> {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response): Promise<void> {
  res.json(await authService.login(req.body));
}

export async function refresh(req: Request, res: Response): Promise<void> {
  res.json(await authService.refresh(req.body.refreshToken));
}

export async function logout(req: Request, res: Response): Promise<void> {
  await authService.logout(req.user!.userId, req.body?.refreshToken);
  res.status(200).json({ message: "Logged out" });
}
