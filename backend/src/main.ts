import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://project3-team-53.vercel.app'],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Server is running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
