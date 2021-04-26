export interface Session {
  jwtToken: string;
  jwtExpiration: Date;
  refreshToken: string;
}
