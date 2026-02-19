import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    const params = new HttpParams().set('username', username).set('password', password);
    return this.http.post<User>(`${this.apiUrl}/login`, null, { params })
      .pipe(
        tap(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
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
