/**
 * src/types/express.d.ts
 * Augment the Express Request interface to include the authenticated user.
 */

import { TokenPayload } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      /** Populated by the auth middleware after token verification */
      user?: TokenPayload;
    }
  }
}

export {};
