export enum UserRole {
  USER = 'USER',
  APPROVER = 'APPROVER',
  SUPERUSER = 'SUPERUSER',
  READONLY = 'READONLY'
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: UserRole | string;
  status?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
