/** Authentication rules, password verification, and refresh-token rotation. */
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../lib/password";
import { signAccessToken, signRefreshToken, TokenPayload, verifyRefreshToken } from "../lib/jwt";
import { ConflictError, UnauthorizedError } from "../lib/errors";

export interface RegisterInput { email: string; password: string; name: string; phone?: string; }
export interface LoginInput { email: string; password: string; }
export interface AuthTokens { accessToken: string; refreshToken: string; }

type PublicUserSource = { id: string; email: string; name: string; phone: string | null; avatarUrl: string | null; role: string; createdAt: Date };
export function toPublicUser(user: PublicUserSource) {
  return { id: user.id, email: user.email, name: user.name, phone: user.phone, avatarUrl: user.avatarUrl, role: user.role, createdAt: user.createdAt };
}

function issueTokens(user: { id: string; email: string; role: string }): AuthTokens {
  const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
}

export async function register(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();
  try {
    const user = await prisma.user.create({
      data: { email, passwordHash: await hashPassword(input.password), name: input.name.trim(), phone: input.phone?.trim() || null },
    });
    const tokens = issueTokens(user);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
    return { ...tokens, user: toPublicUser(user) };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictError("An account with this email already exists");
    }
    throw error;
  }
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email.trim().toLowerCase() } });
  if (!user || user.deletedAt || !(await comparePassword(input.password, user.passwordHash))) {
    throw new UnauthorizedError("Email or password is incorrect");
  }
  const tokens = issueTokens(user);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
  return { ...tokens, user: toPublicUser(user) };
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Refresh token is invalid or expired");
  }

  const user = await prisma.user.findFirst({ where: { id: payload.userId, deletedAt: null, refreshToken } });
  if (!user) throw new UnauthorizedError("Refresh token has been revoked");

  const tokens = issueTokens(user);
  const updated = await prisma.user.updateMany({
    where: { id: user.id, refreshToken },
    data: { refreshToken: tokens.refreshToken },
  });
  if (updated.count !== 1) throw new UnauthorizedError("Refresh token has already been used");
  return tokens;
}

export async function logout(userId: string, refreshToken?: string): Promise<void> {
  await prisma.user.updateMany({
    where: { id: userId, ...(refreshToken ? { refreshToken } : {}) },
    data: { refreshToken: null },
  });
}
