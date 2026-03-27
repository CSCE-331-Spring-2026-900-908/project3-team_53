# project3-team_53

## Production deployment

Main Website: [https://project3-team-53.vercel.app/](https://project3-team-53.vercel.app/)

API Base URL: https://project3-team-53-backend.vercel.app/

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

Install [Node.js](https://nodejs.org/) (current LTS is fine). Use the installer for your OS.

## Setup

1. Clone this repository.

2. Create environment files (they are gitignored; each developer copies them locally).

   **`frontend/.env`**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

   **`backend/.env`** (optional)

   ```env
   PORT=3001
   ```

   If you omit `backend/.env`, the API listens on port **3001** by default (`main.ts`).

3. Install dependencies in both apps:

   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

## Run locally

Start the **backend** first, then the **frontend** (the UI calls the API on port 3001).

- **Backend** (from `backend/`): `npm run start:dev` → `http://localhost:3001`
- **Frontend** (from `frontend/`): `npm run dev` → `http://localhost:3000` (default Next.js port)

API routes use the `/api` prefix (for example: `GET http://localhost:3001/api/hello`).
