import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../services/auth.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.css']
})
export class ClaimListComponent implements OnInit {
  claims: Claim[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private claimService: ClaimService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser || !currentUser.id) {
      this.errorMessage = 'User not authenticated';
      this.loading = false;
      return;
    }

    // Superusers and approvers can see all claims, regular users see only their own
    const claimsObservable = (this.authService.isSuperUser() || this.authService.isApprover())
      ? this.claimService.getAllClaims()
      : this.claimService.getClaimsByUser(currentUser.id);

    claimsObservable.subscribe({
      next: (claims) => {
        this.claims = claims;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load claims';
        this.loading = false;
        console.error('Error loading claims:', error);
      }
    });
  }

  createClaim(): void {
    this.router.navigate(['/claims/new']);
  }

  editClaim(id: number): void {
    this.router.navigate(['/claims/edit', id]);
  }

  deleteClaim(id: number): void {
    if (confirm('Are you sure you want to delete this claim?')) {
      this.claimService.deleteClaim(id).subscribe({
        next: () => {
          this.loadClaims();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete claim';
          console.error('Error deleting claim:', error);
        }
      });
    }
  }
}
