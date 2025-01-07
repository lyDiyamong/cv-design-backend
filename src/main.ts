import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';

async function bootstrap() {
  console.log('DB', process.env.DB_URI);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('App is listening to', process.env.PORT);
  });
}
bootstrap();
