# Prism

A dashboard SaaS for optometrists — patient management, eligibility verification, and SMS campaigns in one place.

## Stack

- **Client**: React 18 + TypeScript + Vite + Tailwind CSS v3 + shadcn/ui + Clerk + React Router v6
- **Server**: Node.js + TypeScript + Express + Clerk SDK + PostgreSQL

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Fill in:
- `VITE_CLERK_PUBLISHABLE_KEY` — from your [Clerk Dashboard](https://dashboard.clerk.com)
- `CLERK_SECRET_KEY` — from your Clerk Dashboard
- `DATABASE_URL` — PostgreSQL connection string

### 3. Run in development

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001
- Health check: http://localhost:3001/health

## Project Structure

```
prism/
  client/   # React frontend
  server/   # Express backend
```
