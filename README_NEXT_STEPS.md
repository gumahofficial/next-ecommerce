# Next Ecommerce — Next Steps

This scaffold now includes:

- NextAuth (Credentials) for admin authentication
- Admin API endpoints for creating products
- Image upload endpoint (accepts base64 data, saves to public/uploads)
- Stripe webhook endpoint (creates basic Order records on checkout.session.completed)

Run locally:
1. Copy `.env.example` to `.env` and fill values (DATABASE_URL, STRIPE keys, NEXTAUTH_URL/SECRET)
2. Start docker-compose to bring Postgres up
3. Install dependencies: `npm install`
4. Generate Prisma client & run migrations: `npx prisma generate && npx prisma migrate dev --name init`
5. Run seed: `npm run seed`
6. Start dev server: `npm run dev`

Admin:
- Use seeded admin: admin@example.com / Password123!
- Visit `/api/auth/signin` to login (NextAuth UI)
- Admin pages: `/admin` and `/admin/new`

Notes:
- This is an MVP scaffold. Next steps: secure NextAuth adapters, hash seeded passwords, add tests, add file storage (S3) for production, and improve UI.
