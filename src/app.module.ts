import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configDotenv } from 'dotenv';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { S3Module } from './s3/s3.module';
import { ConfigModule } from '@nestjs/config';

configDotenv();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI, {
      connectionFactory: (connection) => {
        const logger = new Logger('Mongoose');

        connection.on('connected', () => {
          logger.log('MongoDB connected successfully.');
        });

        connection.on('error', (error) => {
          logger.error(`MongoDB connection error: ${error.message}`);
        });
        return connection;
      },
    }),
    AuthModule,
    CoreModule,
    S3Module,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
