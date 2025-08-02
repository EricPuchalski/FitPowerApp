
export interface DecodedToken {
  sub: string;    // username
  dni: string;
  email: string;
  roles: string[];
  iat: number;    // issued at
  exp: number;    // expiration time
}