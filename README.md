# Next Ecommerce

This repository contains a Next.js ecommerce MVP scaffold with:
- Next.js storefront
- PostgreSQL + Prisma
- NextAuth credentials login
- Stripe checkout
- Admin product creation
- Docker compose setup

## Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Start the database:
   docker-compose up -d
3. Install dependencies:
   npm install
4. Generate Prisma client and run migrations:
   npx prisma generate
   npx prisma migrate dev --name init
5. Seed sample data:
   npm run seed
6. Start the app:
   npm run dev

## Admin login
- Email: admin@example.com
- Password: Password123!

## Notes
- Use Stripe test keys in `.env`.
- Keep secrets in environment variables or GitHub Secrets for production.
- For real uploads, replace local `public/uploads` storage with S3/Spaces or a managed CDN.
