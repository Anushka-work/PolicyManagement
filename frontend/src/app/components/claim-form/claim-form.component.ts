import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../services/auth.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  claim: Claim = {
    claimAmount: undefined,
    claimType: '',
    claimDocuments: '',
    status: 'PENDING'
  };

  isEditMode: boolean = false;
  claimId: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  claimTypes = ['ACCIDENT', 'MEDICAL', 'THEFT', 'NATURAL_DISASTER', 'OTHER'];
  statusOptions = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.claimId = +id;
      this.loadClaim(this.claimId);
    }
  }

  loadClaim(id: number): void {
    this.claimService.getClaimById(id).subscribe({
      next: (claim) => {
        this.claim = claim;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load claim';
        console.error('Error loading claim:', error);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.claimId) {
      this.claimService.updateClaim(this.claimId, this.claim).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/claims']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to update claim';
          console.error('Error updating claim:', error);
        }
      });
    } else {
      const userId = this.authService.currentUserValue?.id;
      if (!userId) {
        this.loading = false;
        this.errorMessage = 'Please log in before applying for a claim';
        return;
      }
      this.claimService.createClaim(this.claim, userId).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/claims']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to create claim';
          console.error('Error creating claim:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/claims']);
  }
}
