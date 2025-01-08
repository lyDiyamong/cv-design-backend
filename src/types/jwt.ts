export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

export type RefreshTokenPayload = Pick<AccessTokenPayload, 'sessionId'>;

export type JwtUser = {
  payload: {
    sessionId: string;
    // For flexibility in payload fields
    [key: string]: any;
  };
  refreshToken: string;
};
