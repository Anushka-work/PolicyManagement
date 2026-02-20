import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Stats
  totalPolicies: number = 0;
  activePolicies: number = 0;
  totalClaims: number = 0;
  pendingClaims: number = 0;
  approvedClaims: number = 0;
  rejectedClaims: number = 0;
  totalUsers: number = 1;
  
  // User info
  username: string = '';
  userRole: string = 'User';
  lastLoginDate: Date = new Date();

  constructor(
    private policyService: PolicyService,
    private claimService: ClaimService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.username = currentUser.username;
      this.userRole = currentUser.role ? this.formatRole(currentUser.role) : 'User';
    }

    this.loadDashboardData();
  }

  formatRole(role: string): string {
    const roleMap: { [key: string]: string } = {
      'USER': 'User',
      'APPROVER': 'Approver',
      'SUPERUSER': 'Super User',
      'READONLY': 'Read Only'
    };
    return roleMap[role.toUpperCase()] || role;
  }

  isAdmin(): boolean {
    return this.authService.isSuperUser();
  }

  isReadOnly(): boolean {
    return this.authService.isReadOnly();
  }

  getRoleDescription(): string {
    if (this.authService.isUser()) {
      return 'You can view policies and apply claims';
    } else if (this.authService.isApprover()) {
      return 'You can view policies and approve claims';
    } else if (this.authService.isSuperUser()) {
      return 'You have full access to create policies and activate registrations';
    } else if (this.authService.isReadOnly()) {
      return 'You have read-only access to view all policies';
    }
    return '';
  }

  loadDashboardData(): void {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser || !currentUser.id) {
      console.error('User not authenticated');
      return;
    }

    // Superusers see all policies, regular users see only their own
    const policiesObservable = this.authService.isSuperUser() 
      ? this.policyService.getAllPolicies()
      : this.policyService.getPoliciesByUser(currentUser.id);

    policiesObservable.subscribe({
      next: (policies) => {
        this.totalPolicies = policies.length;
        this.activePolicies = policies.filter(p => p.policyStatus === 'ACTIVE').length;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });

    // Superusers and approvers see all claims, regular users see only their own
    const claimsObservable = (this.authService.isSuperUser() || this.authService.isApprover())
      ? this.claimService.getAllClaims()
      : this.claimService.getClaimsByUser(currentUser.id);

    claimsObservable.subscribe({
      next: (claims) => {
        this.totalClaims = claims.length;
        this.pendingClaims = claims.filter(c => c.status === 'PENDING').length;
        this.approvedClaims = claims.filter(c => c.status === 'APPROVED').length;
        this.rejectedClaims = claims.filter(c => c.status === 'REJECTED').length;
      },
      error: (error) => {
        console.error('Error loading claims:', error);
      }
    });
  }
}
