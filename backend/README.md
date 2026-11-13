# TCA Usher Recruitment – Backend

## Setup
1. Install Node.js and PostgreSQL. Create a database named `ushering`.
2. `cd backend`, then `npm install`
3. Copy `.env.example` to `.env` and fill in your values.
4. `npx prisma migrate dev` (creates the tables)
5. `npx prisma generate` (creates the client)
6. `npx prisma db seed` (adds languages, an event and the first admin)

Run all Prisma commands from the `backend` folder.