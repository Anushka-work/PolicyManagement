export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: string;
  status?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
