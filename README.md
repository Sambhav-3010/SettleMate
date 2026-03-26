# SettleMate

SettleMate is a full-stack expense sharing app for groups. It helps users create rooms, add shared expenses, track balances, settle dues, and chat in real time.

## Features

- Google OAuth login with secure HttpOnly JWT cookie auth
- Create and manage expense rooms
- Invite users and manage group membership
- Add expenses with custom or equal splits
- Live room chat using Socket.IO
- Group balance calculation and settlement confirmation flow
- User onboarding/profile settings (username + UPI ID)

## Tech Stack

### Frontend
- Next.js (App Router) + React + TypeScript
- Tailwind CSS + Radix UI components
- Axios for API communication
- Socket.IO client for real-time chat/events

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- Passport Google OAuth 2.0
- JWT auth via cookies
- Socket.IO server

## System Architecture

![SettleMate System Architecture](./Frontend/public/System.png)

### How It Works

1. User signs in through Google OAuth (`/auth/google`).
2. Backend validates OAuth callback, signs JWT, and sets an HttpOnly auth cookie.
3. Frontend calls protected REST APIs (`/users`, `/rooms`, `/rooms/:roomId/expenses`, etc.) with credentials.
4. Backend verifies auth middleware, applies business logic, and persists data via Prisma to PostgreSQL.
5. For chat and live updates, frontend opens a Socket.IO connection and joins room channels.
6. New messages/expense-related events are broadcast to room members in real time.

## Project Structure

```text
Settlemate/
  Frontend/                # Next.js app
    app/                   # App Router pages
    components/            # UI + feature components
    contexts/              # Auth context
    hooks/                 # Auth guard and utility hooks

  Backend/                 # Express + Prisma API
    app/server.ts          # Entry point + Socket.IO setup
    controllers/           # Business logic
    routes/                # API routes
    middlewares/           # Auth middleware
    prisma/                # Schema + migrations
    utils/                 # JWT, cookies, passport, prisma client
```

## API Modules (Backend)

- `auth`: Google OAuth, current user check, logout
- `users`: profile, rooms, invites, search, profile update
- `rooms`: create/list/update rooms, members, invites, messages
- `rooms/:roomId/expenses`: create/list expenses, balances, settlement actions

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- Google OAuth credentials

### 1) Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env` from `.env.example` and fill values:

```env
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/settlemate
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
AUTH_COOKIE_NAME=auth_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run migrations and start backend:

```bash
npx prisma migrate dev
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Frontend Setup

```bash
cd Frontend
npm install
```

Create `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Backend Docker (Optional)

From `Backend/`:

```bash
docker compose up --build
```

## Notes

- Auth is cookie-based, so frontend requests must include credentials.
- CORS origins are controlled via `FRONTEND_URL` / `FRONTEND_URLS`.
- Prisma schema includes core expense-sharing entities: `User`, `Room`, `RoomMember`, `Message`, `Invite`, `Expense`, and `Split`.
