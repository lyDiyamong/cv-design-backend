import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodExceptionFilter } from './common/filters/zod.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  // Register ZodValidationPipe globally
  app.useGlobalPipes(new ZodValidationPipe());

  app.use(cookieParser());

  // Register ZodExceptionFilter globally
  app.useGlobalFilters(new ZodExceptionFilter());
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('App is listening to', process.env.PORT);
  });
}
bootstrap();
