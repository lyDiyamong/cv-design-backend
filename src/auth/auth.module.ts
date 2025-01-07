import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

// Module
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
// Service
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Strategy
import { JwtStrategy, JwtRefreshStrategy, CookieStrategy } from './strategies';
import { TokenService } from './token/token.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    JwtRefreshStrategy,
    CookieStrategy,
    ConfigService,
    TokenService,
  ],
  imports: [
    UserModule,
    TokenModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
})
export class AuthModule {}
