/**
 * src/middleware/validate.ts
 * Request validation middleware using Zod schemas.
 */

import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { BadRequestError } from "../lib/errors";

/**
 * Factory that returns middleware to validate req.body, req.query, and req.params
 * against the provided Zod schema.
 *
 * The schema should be shaped like:
 *   z.object({ body: ..., query: ..., params: ... })
 */
export function validate(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace with parsed (coerced/transformed) values
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        throw new BadRequestError("Validation failed", formatted);
      }
      throw err;
    }
  };
}
