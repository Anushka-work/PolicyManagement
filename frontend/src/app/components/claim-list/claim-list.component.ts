import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../services/auth.service';
import { Claim } from '../../models/claim.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.css']
})
export class ClaimListComponent implements OnInit {
  claims: Claim[] = [];
  loading: boolean = false;

  constructor(
    private claimService: ClaimService,
    private router: Router,
    public authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser || !currentUser.id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not authenticated' });
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load claims' });
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
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim deleted successfully' });
          this.loadClaims();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete claim' });
          console.error('Error deleting claim:', error);
        }
      });
    }
  }

  approveClaim(id: number): void {
    if (confirm('Are you sure you want to approve this claim?')) {
      this.claimService.approveClaim(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim approved successfully' });
          this.loadClaims();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve claim' });
          console.error('Error approving claim:', error);
        }
      });
    }
  }

  rejectClaim(id: number): void {
    if (confirm('Are you sure you want to reject this claim?')) {
      this.claimService.rejectClaim(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim rejected successfully' });
          this.loadClaims();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to reject claim' });
          console.error('Error rejecting claim:', error);
        }
      });
    }
  }
}
