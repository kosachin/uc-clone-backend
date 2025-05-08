import { NestFactory } from '@nestjs/core';
import { BackendApiModule } from './backend-api.module';
import { RequestLoggerMiddleware } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BackendApiModule);
  await app.listen(process.env.port ?? 3000);
  app.use(RequestLoggerMiddleware);
}
bootstrap();
