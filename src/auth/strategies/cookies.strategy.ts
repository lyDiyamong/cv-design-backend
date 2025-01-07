import { Injectable } from '@nestjs/common';
import { Response } from 'express';
export type SetCookieParam = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class CookieStrategy {
  setCookies({ res, accessToken, refreshToken }: SetCookieParam) {
    return res
      .cookie('accessToken', accessToken)
      .cookie('refreshToken', refreshToken);
  }
  clearCookie(res: Response) {
    return res
      .clearCookie('accessToken')
      .clearCookie('refreshToken', { path: '/auth/refresh' });
  }
}
