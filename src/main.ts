import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodExceptionFilter } from './common/filters/zod.filter';

async function bootstrap() {
  console.log('DB', process.env.DB_URI);
  const app = await NestFactory.create(AppModule);
  // Register ZodValidationPipe globally
  app.useGlobalPipes(new ZodValidationPipe());

  // Register ZodExceptionFilter globally
  app.useGlobalFilters(new ZodExceptionFilter());
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('App is listening to', process.env.PORT);
  });
}
bootstrap();
