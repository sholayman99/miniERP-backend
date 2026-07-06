# Mini ERP — API Documentation

**Base URL:** `/api/v1`

## Conventions

**Authentication:** send the JWT returned by `POST /auth/login` as a header:

```
Authorization: Bearer <token>
```

**Response envelope**

```jsonc
// success
{ "ok": true, "data": <payload>, "meta": <pagination?> }
// error
{ "ok": false, "error": { "code": "<CODE>", "message": "<message>", "details": <optional> } }
```

**Pagination `meta`** (list endpoints): `{ "page", "limit", "total", "totalPages" }`.

**Common status codes:** `200` OK · `201` Created · `400` Bad Request / validation · `401` Unauthorized · `403` Forbidden (missing permission) · `404` Not Found · `409` Conflict (duplicate SKU) · `429` Rate limited · `500` Internal error.

**List query params** (products & sales): `page` (default 1), `limit` (default 10, max 100), `sort` (e.g. `-createdAt`), `search` (products only), `category` (products only).

---

## Auth

### POST `/auth/login`
Public. Body: `{ "email": string, "password": string }`

`200` → `{ "user": { "id", "name", "email", "role": { "id", "name", "label" } }, "token": string }`
`401` → invalid credentials.

### GET `/auth/me`
Auth required. Returns the current user profile and permissions.

`200` → `{ "id", "name", "email", "role": { "name", "label" }, "permissions": string[] }`

### POST `/auth/logout`
Auth required. Stateless — the client discards its token. `200` → `{ "loggedOut": true }`

---

## Products

Model: `{ _id, name, sku, category, purchasePrice, sellingPrice, stockQuantity, imageUrl, createdAt, updatedAt }`

### GET `/products`
Permission: `products:read`. Query: `page`, `limit`, `search` (name/sku/category), `category`, `sort`.

`200` → `data: Product[]`, `meta: { page, limit, total, totalPages }`

### GET `/products/:id`
Permission: `products:read`. `200` → `data: Product` · `404` if not found.

### POST `/products`
Permission: `products:create`. Content-Type: `multipart/form-data`.
Fields: `name`, `sku`, `category`, `purchasePrice`, `sellingPrice`, `stockQuantity`, and **`image`** (file, required — jpeg/png/webp, ≤ 5MB).

`201` → `data: Product` · `400` if image missing/invalid · `409` if SKU already exists.

### PUT `/products/:id`
Permission: `products:update`. Content-Type: `multipart/form-data`. Any subset of the create fields; `image` optional (keeps current image if omitted).

`200` → `data: Product`

### DELETE `/products/:id`
Permission: `products:delete`. `200` → `{ "deleted": true }`

---

## Sales

Model: `{ _id, items: [{ product, productName, quantity, unitPrice, subtotal }], grandTotal, soldBy, createdAt }`

### POST `/sales`
Permission: `sales:create`. Body:

```json
{ "items": [ { "product": "<productId>", "quantity": 2 } ] }
```

Server logic (atomic transaction): validates stock for each line, decrements `stockQuantity`, snapshots product name + unit price, computes `grandTotal`, and records the sale under the authenticated user (`soldBy`).

`201` → `data: Sale` · `400` if a product has insufficient stock · `404` if a product doesn't exist.

### GET `/sales`
Permission: `sales:read`. Query: `page`, `limit`, `sort`. `soldBy` is populated with `{ name, email }`.

`200` → `data: Sale[]`, `meta: { ... }`

### GET `/sales/:id`
Permission: `sales:read`. `200` → `data: Sale` · `404` if not found.

---

## Dashboard

### GET `/dashboard`
Permission: `dashboard:read`.

`200` → `{ "totalProducts": number, "totalSales": number, "lowStockProducts": [ { "_id", "name", "sku", "stockQuantity" } ] }`
(low-stock = products with `stockQuantity < 5`, sorted ascending).

---

## Roles & Permissions (RBAC)

Roles and permissions are stored in the database. Roles hold a list of permission keys; changing a role's permissions takes effect within a short cache TTL without redeploy.

### GET `/roles` · GET `/roles/:id`
Permission: `roles:manage`. Returns roles with their populated permissions.

### PUT `/roles/:id/permissions`
Permission: `roles:manage`. Body: `{ "permissions": string[] }` (permission keys). Updates the role and invalidates the permission cache.

### GET `/permissions`
Permission: `roles:manage`. Returns all available permission definitions.

**Permission keys:** `products:create`, `products:read`, `products:update`, `products:delete`, `sales:create`, `sales:read`, `dashboard:read`, `roles:manage`, `users:manage`.

**Default role matrix**

| Role | Permissions |
|---|---|
| Admin | all |
| Manager | products:* , sales:create , sales:read , dashboard:read |
| Employee | products:read , sales:create |

---

## Users

### GET `/users`
Permission: `users:manage`. Lists users with their populated role.

### POST `/users`
Permission: `users:manage`. Body: `{ "name", "email", "password", "roleId": "<roleId>" }`. `409` on duplicate email.

### PATCH `/users/:id/active`
Permission: `users:manage`. Body: `{ "isActive": boolean }`. Activates/deactivates a user.

---

## Health

### GET `/health`
Public. `200` → service status (used by Render health checks).
