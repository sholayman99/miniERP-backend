# Mini ERP — Backend API

Inventory & Sales Management System backend built with **Node.js, Express, TypeScript, MongoDB, Mongoose, and JWT**.

## Features

- JWT authentication (Bearer token) with login + protected routes
- Database-driven role & permission system (Admin / Manager / Employee)
- Products module: CRUD, image upload (Cloudinary), search, category filter, pagination
- Sales module: multi-product sales with atomic stock decrement, insufficient-stock protection, grand-total calculation, and sale history
- Dashboard statistics: total products, total sales, low-stock products (stock < 5)
- Generic query builder (search / filter / sort / pagination)
- Global error handler with a consistent API response envelope
- Zod input validation, Helmet, CORS, rate limiting, request IDs, structured logging

## Tech Stack

Node.js · Express · TypeScript · MongoDB · Mongoose · JWT · Zod · Multer · Cloudinary · Pino

## Requirements

- Node.js >= 20.9
- MongoDB **Atlas** (or any replica-set MongoDB — sale creation uses a transaction, which requires a replica set)
- A Cloudinary account (free tier) for product image storage

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values (see below)
npm run seed           # seeds permissions, roles, and demo users
npm run dev            # starts on http://localhost:5000
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | no | `development` \| `production` (default `development`) |
| `PORT` | no | API port (default `5000`) |
| `ADMIN_URL` | yes | Frontend origin, used for CORS (e.g. your Netlify URL) |
| `MONGODB_URI` | yes | MongoDB connection string (Atlas recommended) |
| `JWT_ACCESS_SECRET` | yes | Secret for signing JWTs (min 16 chars) |
| `JWT_ACCESS_TTL_MIN` | no | Token lifetime in minutes (default `1440`) |
| `CLOUDINARY_CLOUD_NAME` | yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | yes | Cloudinary API secret |
| `LOG_LEVEL` | no | `debug` \| `info` \| `warn` \| `error` (default `info`) |

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled server (`dist/server.js`) |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | ESLint |
| `npm run seed` | Seed permissions, roles, and demo users |

## Seeded credentials

`npm run seed` creates three users (override with `SEED_*` env vars):

| Role | Email | Password | Permissions |
|---|---|---|---|
| Admin | `admin@erp.test` | `Admin@123` | Full access |
| Manager | `manager@erp.test` | `Manager@123` | Manage products, create sales, dashboard |
| Employee | `employee@erp.test` | `Employee@123` | View products, create sales |

## API

Base URL: `/api/v1`. See [API.md](./API.md) for the full endpoint reference.

All responses use a consistent envelope:

```jsonc
// success
{ "ok": true, "data": { ... }, "meta": { ... } }
// error
{ "ok": false, "error": { "code": "BAD_REQUEST", "message": "...", "details": { ... } } }
```

## Deploy to Render

1. Push this `backend/` folder to a public GitHub repo.
2. On Render → **New → Web Service**, connect the repo (root directory = `backend`).
3. Build command: `npm install && npm run build` · Start command: `npm run start`.
4. Health check path: `/api/v1/health`.
5. Add the environment variables from the table above (`ADMIN_URL` = your Netlify URL, plus the MongoDB Atlas URI, a strong `JWT_ACCESS_SECRET`, and the Cloudinary keys).
6. After the first deploy, run the seed once — either locally against the Atlas URI (`MONGODB_URI=... npm run seed`) or as a Render one-off job.

A `render.yaml` blueprint is included for convenience.

## Architecture

Modular feature-based structure under `src/modules/*` (auth, products, sales, dashboard, roles, permissions, users, inventory, health). Shared utilities live in `src/lib/*` (query-builder, response, errors, upload, role-cache, logger) and cross-cutting middleware in `src/middleware/*` (require-auth, require-permission, validate, error-handler, rate-limit, request-id).
