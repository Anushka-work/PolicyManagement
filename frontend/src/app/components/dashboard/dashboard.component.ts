import { Component, OnInit } from '@angular/core';
import { PolicyService } from '../../services/policy.service';
import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  policyCount: number = 0;
  claimCount: number = 0;
  pendingClaimsCount: number = 0;
  username: string = '';
  lastLoginDate: Date = new Date();

  constructor(
    private policyService: PolicyService,
    private claimService: ClaimService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.username = currentUser.username;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.policyService.getAllPolicies().subscribe({
      next: (policies) => {
        this.policyCount = policies.length;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });

    this.claimService.getAllClaims().subscribe({
      next: (claims) => {
        this.claimCount = claims.length;
        this.pendingClaimsCount = claims.filter(c => c.status === 'PENDING').length;
      },
      error: (error) => {
        console.error('Error loading claims:', error);
      }
    });
  }
}
