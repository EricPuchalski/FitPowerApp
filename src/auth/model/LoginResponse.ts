export interface LoginResponse {
  token: string;
  roles: string[];
  id: number;
  username: string;
  email: string;
  dni: string;
  gymName: string;
}
