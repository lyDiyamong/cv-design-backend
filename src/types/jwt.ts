export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

export type RefreshTokenPayload = Pick<AccessTokenPayload, 'sessionId'>;

export type JwtRefreshUser = {
  payload: RefreshTokenPayload;
  refreshToken: string;
};

export type JwtUser = {
  payload: AccessTokenPayload;
};
