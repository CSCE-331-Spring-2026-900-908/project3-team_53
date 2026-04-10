# project3-team_53

## Production deployment

Main Website: [https://project3-team-53.vercel.app/](https://project3-team-53.vercel.app/)

API Base URL: https://project3-team-53-backend.vercel.app/api

## Tech stack

| Area | Technologies |
| --- | --- |
| **Runtime** | Node.js |
| **Frontend** | [Next.js](https://nextjs.org/) 16 (App Router), [React](https://react.dev/) 19, TypeScript |
| **UI & styling** | [MUI (Material UI)](https://mui.com/) 7, [Emotion](https://emotion.sh/), [Tailwind CSS](https://tailwindcss.com/) 4 |
| **HTTP client** | [Axios](https://axios-http.com/) |
| **Backend** | [NestJS](https://nestjs.com/) 11 on [Express](https://expressjs.com/) (`@nestjs/platform-express`), TypeScript |
| **Tooling** | ESLint; backend also uses Jest and Prettier |

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS is fine). Use the installer for your OS.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) for running a local PostgreSQL database.

## Local database setup (Docker)

1. Install and open [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Make sure Docker Desktop is **running** (you should see the Docker icon in your system tray / menu bar).
3. From the **project root**, start the database container:

   ```bash
   docker compose up -d
   ```

   This pulls the official PostgreSQL 17 image and starts a container with:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **User / Password:** `postgres` / `postgres`
   - **Database:** `postgres`

   Data is persisted in a Docker volume (`pgdata`), so it survives container restarts.

4. To verify the database is running:

   ```bash
   docker compose ps
   ```

5. To stop the database:

   ```bash
   docker compose down
   ```

   Add the `-v` flag (`docker compose down -v`) to also delete the stored data and start fresh.

## Setup

1. Clone this repository.

2. Create environment files from the provided examples (they are gitignored; each developer copies them locally).

   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

   **`frontend/.env`**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

   **`backend/.env`**

   ```env
   PORT=3001
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=postgres

   # Local Docker database - no SSL needed
   DB_SYNCHRONIZE=true
   DB_SSL=false
   ```

   If you omit `backend/.env`, the API listens on port **3001** by default (`main.ts`) and uses the default local PostgreSQL values shown above.

3. Install dependencies in both apps:

   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

## Run locally

1. Start the **database** (if not already running): `docker compose up -d`
2. Start the **backend** (from `backend/`): `npm run start:dev` → `http://localhost:3001`
3. Start the **frontend** (from `frontend/`): `npm run dev` → `http://localhost:3000` (default Next.js port)

API routes use the `/api` prefix (for example: `GET http://localhost:3001/api/hello`).
