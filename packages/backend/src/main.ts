import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configSerivce = app.get(ConfigService);
  const PORT = configSerivce.get<string>('PORT') || '3000';
  await app.listen(PORT);
}

bootstrap();
