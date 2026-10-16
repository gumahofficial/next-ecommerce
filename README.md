# next-ecommerce

Next.js storefront scaffold (TypeScript) with Prisma + PostgreSQL + Stripe (test keys).

This repository contains a starter scaffold for a Next.js ecommerce MVP. It includes:

- Next.js (TypeScript) app structure
- Prisma schema for PostgreSQL
- Example seed script (prisma/seed.js) and API seed endpoint
- Dockerfile and docker-compose (app + postgres)
- .env.example with required variables

Quick start (development):

1. Copy .env.example to .env and fill values.
2. Start PostgreSQL with Docker Compose:
   docker-compose up -d
3. Install dependencies locally:
   npm install
4. Generate Prisma client & run migrations:
   npx prisma generate
   npx prisma migrate dev --name init
5. Run the dev server:
   npm run dev
6. (Optional) Run the seed endpoint in the browser to create sample data:
   http://localhost:3000/api/seed

Notes:
- The project uses Stripe in test mode by default. Add real keys in production via environment variables / GitHub Secrets.
- For production deployment, build the app and configure environment variables and persistent storage for uploads.
