import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../services/auth.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  claimForm!: FormGroup;

  isEditMode: boolean = false;
  claimId: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  claimTypes = [
    { label: 'Accident', value: 'ACCIDENT' },
    { label: 'Medical', value: 'MEDICAL' },
    { label: 'Theft', value: 'THEFT' },
    { label: 'Natural Disaster', value: 'NATURAL_DISASTER' },
    { label: 'Other', value: 'OTHER' }
  ];

  statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.claimId = +id;
      this.loadClaim(this.claimId);
    }
  }

  initializeForm(): void {
    this.claimForm = this.formBuilder.group({
      claimAmount: ['', [Validators.required, Validators.min(0)]],
      claimType: ['', [Validators.required]],
      claimDocuments: ['', [Validators.required]],
      status: [{ value: 'PENDING', disabled: !this.isEditMode }, [Validators.required]]
    });
  }

  loadClaim(id: number): void {
    this.claimService.getClaimById(id).subscribe({
      next: (claim) => {
        this.claimForm.patchValue(claim);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load claim';
        console.error('Error loading claim:', error);
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.claimForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    const formValue = this.isEditMode 
      ? this.claimForm.value 
      : { ...this.claimForm.value, status: 'PENDING' };

    if (this.isEditMode && this.claimId) {
      this.claimService.updateClaim(this.claimId, formValue).subscribe({
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
      this.claimService.createClaim(formValue, userId).subscribe({
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

  get f() {
    return this.claimForm.controls;
  }
}
