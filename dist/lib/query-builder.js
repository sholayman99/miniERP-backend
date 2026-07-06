"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseListQuery = parseListQuery;
exports.buildSearchFilter = buildSearchFilter;
exports.buildFieldFilters = buildFieldFilters;
exports.buildMeta = buildMeta;
/** Reads page/limit/sort/search off req.query with sane defaults + caps. */
function parseListQuery(query, opts = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(opts.maxLimit ?? 100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;
    const sort = query.sort || opts.defaultSort || '-createdAt';
    const search = query.search || undefined;
    return { page, limit, skip, sort, search };
}
/** Builds a case-insensitive $or filter across the given text fields. */
function buildSearchFilter(search, fields = []) {
    if (!search || fields.length === 0)
        return {};
    // Escape regex metacharacters so user input is matched literally (prevents
    // invalid-pattern 500s and catastrophic-backtracking ReDoS).
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    return { $or: fields.map((f) => ({ [f]: regex })) };
}
/** Passes through exact-match filters for any allow-listed field present in the query. */
function buildFieldFilters(query, allowedFields = []) {
    const filter = {};
    for (const field of allowedFields) {
        if (query[field] !== undefined && query[field] !== '') {
            filter[field] = query[field];
        }
    }
    return filter;
}
function buildMeta(parsed, total) {
    return {
        page: parsed.page,
        limit: parsed.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsed.limit)),
    };
}
//# sourceMappingURL=query-builder.js.map