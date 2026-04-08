import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = new Set<string>([
    'http://localhost:3000',
    'https://project3-team-53.vercel.app',
    'https://api.schlichenmeyer.com',
    ...configuredOrigins,
  ]);

  const isVercelPreviewOrigin = (origin: string) =>
    /^https:\/\/project3-team-53(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: (origin, callback) => {
      // Non-browser clients (no Origin header) should still be allowed.
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin) || isVercelPreviewOrigin(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Server is running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
