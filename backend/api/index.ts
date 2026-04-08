import type { Request, Response } from 'express';

const allowedOrigins = new Set([
  'http://localhost:3000',
  'https://project3-team-53.vercel.app',
]);

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.has(origin)) return true;
  return /^https:\/\/project3-team-53(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(
    origin,
  );
}

function setCorsHeaders(req: Request, res: Response) {
  const origin = req.headers.origin ?? '';
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

let appHandler: any;

async function getAppHandler() {
  if (!appHandler) {
    const { NestFactory } = await import('@nestjs/core');
    const { AppModule } = await import('../src/app.module.js');
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

    app.setGlobalPrefix('api');

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (isAllowedOrigin(origin)) return callback(null, true);
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await app.init();
    appHandler = app.getHttpAdapter().getInstance();
  }
  return appHandler;
}

export default async function handler(req: Request, res: Response) {
  // Handle preflight immediately without initializing NestJS
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.status(204).end();
    return;
  }

  try {
    setCorsHeaders(req, res);
    const app = await getAppHandler();
    app(req, res);
  } catch (err) {
    setCorsHeaders(req, res);
    res.status(500).json({ error: 'Internal server error' });
  }
}
