import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from 'src/types';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private accessTokenOptions = {
    secret: this.configService.get('JWT_ACCESS_SECRET'),
    expiresIn: '15m',
  };
  private refreshTokenOptions = {
    secret: this.configService.get('JWT_REFRESH_SECRET'),
    expiresIn: '7d',
  };

  async generateTokens(userId: string, sessionId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          sessionId,
        },
        this.accessTokenOptions,
      ),
      this.jwtService.signAsync(
        {
          sessionId,
        },
        this.refreshTokenOptions,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generic method to validate a token.
   * @param token The JWT to validate.
   * @param options Verification options including secret and other configurations.
   * @returns An object containing the decoded payload or an error message.
   */
  async validateToken<TPayload extends object = AccessTokenPayload>(
    token: string,
    options: { secret: string },
  ): Promise<{ payload?: TPayload; error?: string }> {
    try {
      const { secret, ...verifyOpts } = options;
      const payload = (await this.jwtService.verifyAsync<TPayload>(token, {
        secret,
        ...verifyOpts,
      })) as TPayload;
      return { payload };
    } catch (error) {
      return { error: error.message };
    }
  }
}
