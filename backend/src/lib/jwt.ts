/**
 * src/lib/jwt.ts
 * JWT token utilities — sign, verify, and decode access & refresh tokens.
 */

import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

/** Payload stored inside every JWT */
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Sign an access token (short-lived).
 */
export function signAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

/**
 * Sign a refresh token (long-lived).
 */
export function signRefreshToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

/**
 * Verify and decode an access token.
 * Throws if the token is invalid or expired.
 */
export function verifyAccessToken(token: string): TokenPayload & JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload & JwtPayload;
}

/**
 * Verify and decode a refresh token.
 * Throws if the token is invalid or expired.
 */
export function verifyRefreshToken(token: string): TokenPayload & JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload & JwtPayload;
}
