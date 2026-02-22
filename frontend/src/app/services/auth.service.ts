import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private readonly STORAGE_KEY = 'currentUser';

  constructor(private http: HttpClient) { }

  public get currentUserValue(): User | null {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  login(username: string, password: string): Observable<User> {
    const params = new HttpParams().set('username', username).set('password', password);
    return this.http.post<User>(`${this.apiUrl}/login`, null, { params });
  }

  // Save user after successful login
  saveCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  // Role-based access control methods
  hasRole(role: UserRole | string): boolean {
    const currentUser = this.currentUserValue;
    if (!currentUser || !currentUser.role) {
      return false;
    }
    return currentUser.role.toString().toUpperCase() === role.toString().toUpperCase();
  }

  hasAnyRole(roles: (UserRole | string)[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  // Specific role checks
  isUser(): boolean {
    return this.hasRole(UserRole.USER);
  }

  isApprover(): boolean {
    return this.hasRole(UserRole.APPROVER);
  }

  isSuperUser(): boolean {
    return this.hasRole(UserRole.SUPERUSER);
  }

  isReadOnly(): boolean {
    return this.hasRole(UserRole.READONLY);
  }

  // Permission checks based on requirements
  canViewPolicies(): boolean {
    return this.hasAnyRole([UserRole.USER, UserRole.APPROVER, UserRole.SUPERUSER, UserRole.READONLY]);
  }

  canCreatePolicy(): boolean {
    return this.hasRole(UserRole.SUPERUSER);
  }

  canApplyClaim(): boolean {
    return this.hasRole(UserRole.USER);
  }

  canApproveClaim(): boolean {
    return this.hasRole(UserRole.APPROVER);
  }

  canActivateRegistration(): boolean {
    return this.hasRole(UserRole.SUPERUSER);
  }

  // User management methods
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  activateUser(userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/activate`, {});
  }

  deactivateUser(userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/deactivate`, {});
  }
}
