import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from 'src/schemas/session';
import { User } from 'src/schemas/user';
import { comparePassword } from 'src/utils/bcrypt';
import { LoginDto, SignUpDto } from 'src/utils/schemas';
import { TokenService } from './token/token.service';
import { CookieStrategy, JwtRefreshStrategy } from './strategies';
import { RefreshTokenPayload, AccessTokenPayload } from 'src/types';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private tokenService: TokenService,
    private configService: ConfigService,
    private readonly jwtRefreshStrategy: JwtRefreshStrategy,
  ) {}

  async signUp(dto: SignUpDto) {
    const userExist = await this.userModel.exists({ email: dto.email });

    if (userExist) throw new ForbiddenException('User already existed');

    const userCreated = await this.userModel.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth,
    });

    const sessionCreated = await this.sessionModel.create({
      userAgent: dto.userAgent,
      userId: userCreated._id,
    });

    const sessionId = sessionCreated._id.toString();
    const userId = userCreated._id.toString();

    // generate token
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userId, sessionId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new ForbiddenException('Access denied');

    const passwordMatch = await comparePassword(dto.password, user.password);
    if (!passwordMatch) throw new ForbiddenException('Wrong Password');

    const session = await this.sessionModel.create({
      userAgent: dto.userAgent,
      userId: user._id,
    });
    const userId = user._id.toString();
    const sessionId = session?._id?.toString();

    // generate token
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userId, sessionId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(accessToken: string): Promise<void> {
    if (!accessToken) throw new JsonWebTokenError('Token expired');

    const { payload, error } = await this.tokenService.validateToken(
      accessToken,
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      },
    );
    if (error) throw new UnauthorizedException('Session expired');

    await this.sessionModel.findByIdAndDelete(payload.sessionId);
  }

  async refreshTokens(refreshToken: string) {
    // Verify if the refresh token is valid and hasn't been tampered with
    const { payload, error } =
      await this.tokenService.validateToken<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

    if (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const session = await this.sessionModel.findById(payload.sessionId);

    const userId = session?.userId?.toString();

    // Generate new access and refresh tokens
    const newTokens = await this.tokenService.generateTokens(
      userId,
      payload.sessionId,
    );

    return {
      newAccessToken: newTokens.accessToken,
      // newRefreshToken: newTokens.refreshToken,
    };
  }
}
