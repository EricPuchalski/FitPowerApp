//src/auth/model/LoginRequest.ts
export interface LoginResponse {
  message: string;
  token: string;
  roles: string[];
  id: number;
  username: string;
  email: string;
  dni: string;
  gymName: string;
}
