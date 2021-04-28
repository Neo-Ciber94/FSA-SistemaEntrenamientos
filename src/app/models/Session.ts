export interface Session {
  token: string;
  tokenExpiration: Date;
  refreshToken: string;
}
