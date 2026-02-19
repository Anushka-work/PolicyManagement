import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<UserRole | string>;
    
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = currentUser.role?.toString().toUpperCase();
      const hasRole = allowedRoles.some(role => role.toString().toUpperCase() === userRole);
      
      if (!hasRole) {
        // User doesn't have permission, redirect to dashboard
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    return true;
  }
}
