import { Role } from '../modules/roles/role.model'

type CacheEntry = { permissions: Set<string>; expiresAt: number }

const CACHE_TTL_MS = 30_000
const cache = new Map<string, CacheEntry>()

/**
 * Returns the set of permission keys for a given roleId.
 * Cached for CACHE_TTL_MS so permission checks stay dynamic (DB-driven)
 * without a DB round trip on every single request.
 */
export async function getRolePermissions(roleId: string): Promise<Set<string>> {
  const cached = cache.get(roleId)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.permissions
  }

  const role = await Role.findById(roleId).populate('permissions', 'key').lean()
  const permissions = new Set<string>(
    ((role?.permissions as unknown as { key: string }[] | undefined) ?? []).map((p) => p.key),
  )

  cache.set(roleId, { permissions, expiresAt: Date.now() + CACHE_TTL_MS })
  return permissions
}

/** Call this from your roles controller after updating a role's permissions,
 * so the change is picked up immediately instead of waiting for TTL expiry. */
export function invalidateRoleCache(roleId?: string) {
  if (roleId) {
    cache.delete(roleId)
  } else {
    cache.clear()
  }
}
