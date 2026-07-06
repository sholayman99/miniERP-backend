export type QueryBuilderOptions = {
  defaultSort?: string
  maxLimit?: number
}

export type ParsedQuery = {
  page: number
  limit: number
  skip: number
  sort: string
  search?: string
}

/** Reads page/limit/sort/search off req.query with sane defaults + caps. */
export function parseListQuery(
  query: Record<string, unknown>,
  opts: QueryBuilderOptions = {},
): ParsedQuery {
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(opts.maxLimit ?? 100, Math.max(1, Number(query.limit) || 10))
  const skip = (page - 1) * limit
  const sort = (query.sort as string) || opts.defaultSort || '-createdAt'
  const search = (query.search as string) || undefined
  return { page, limit, skip, sort, search }
}

/** Builds a case-insensitive $or filter across the given text fields. */
export function buildSearchFilter(search: string | undefined, fields: string[] = []) {
  if (!search || fields.length === 0) return {}
  // Escape regex metacharacters so user input is matched literally (prevents
  // invalid-pattern 500s and catastrophic-backtracking ReDoS).
  const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'i')
  return { $or: fields.map((f) => ({ [f]: regex })) }
}

/** Passes through exact-match filters for any allow-listed field present in the query. */
export function buildFieldFilters(query: Record<string, unknown>, allowedFields: string[] = []) {
  const filter: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (query[field] !== undefined && query[field] !== '') {
      filter[field] = query[field]
    }
  }
  return filter
}

export function buildMeta(parsed: ParsedQuery, total: number) {
  return {
    page: parsed.page,
    limit: parsed.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / parsed.limit)),
  }
}
