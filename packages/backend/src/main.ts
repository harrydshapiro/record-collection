import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('PORT');
  if (!PORT) {
    throw new Error('Must provide port');
  }
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      allowedHeaders: ['content-type'],
      origin: 'http://localhost:3000',
      credentials: true,
    });
  }
  await app.listen(PORT);
  console.log('app listening on port', PORT);
}
bootstrap();
