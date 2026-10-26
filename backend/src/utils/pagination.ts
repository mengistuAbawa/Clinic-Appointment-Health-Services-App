/**
 * src/utils/pagination.ts
 * Helpers for paginating Prisma query results.
 */

/** Standardised pagination response envelope */
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/** Parse page & limit query params into skip/take values */
export function parsePagination(query: {
  page?: string | number;
  limit?: string | number;
}): { page: number; limit: number; skip: number; take: number } {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

/** Build the paginated response object */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  return {
    data,
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}
