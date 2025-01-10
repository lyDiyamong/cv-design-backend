import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Observable, lastValueFrom } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private httpService: HttpService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      // Attempt to validate the access token
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      console.log(err.name);
      // If the token is expired, attempt to refresh
      if (err.name === 'JsonWebTokenError') {
        const refreshed = await this.handleTokenRefresh(request, response);
        if (refreshed) {
          return true;
        }
      }
      throw new UnauthorizedException('User unauthorized');
    }
  }

  async handleTokenRefresh(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      // Call the refresh endpoint to get new tokens
      const result = await lastValueFrom(
        this.httpService.get('http://localhost:8000/api/v1/auth/refresh', {
          headers: {
            Cookie: `refreshToken=${refreshToken}`, // Pass the refresh token
          },
        }),
      );
      console.log('data', result);
      const { newAccessToken, newRefreshToken } = result.data;

      // Update cookies or headers with the new tokens
      response.cookie('accessToken', newAccessToken);
      response.cookie('refreshToken', newRefreshToken);

      // Attach the new user information to the request
      request.headers['authorization'] = `Bearer ${newAccessToken}`;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh token');
    }
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
