import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css']
})
export class PolicyFormComponent implements OnInit {
  policyForm!: FormGroup;

  isEditMode: boolean = false;
  isViewMode: boolean = false;
  policyId: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  maxDate: Date = new Date(); // For date of birth validation

  planTypes = [
    { label: 'Term Life', value: 'TERM_LIFE' },
    { label: 'Health Insurance', value: 'HEALTH_ENSURANCE' },
    { label: 'Whole Life', value: 'WHOLE_LIFE' }
  ];

  premiumFrequencies = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' }
  ];

  statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Pending', value: 'PENDING' }
  ];

  nomineeRelationships = [
    { label: 'Spouse', value: 'SPOUSE' },
    { label: 'Parent', value: 'PARENT' },
    { label: 'Child', value: 'CHILD' },
    { label: 'Sibling', value: 'SIBLING' },
    { label: 'Other', value: 'OTHER' }
  ];

  constructor(
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // Check if we're in view mode based on the URL
    this.isViewMode = this.router.url.includes('/policies/view/');
    
    // Check if user has permission to create/edit policies
    // Allow view mode for all authenticated users
    if (!this.isViewMode && !this.authService.canCreatePolicy()) {
      this.errorMessage = 'Access Denied: Only SUPERUSER can create or edit policies';
      setTimeout(() => {
        this.router.navigate(['/policies']);
      }, 2000);
      return;
    }
    
    this.initializeForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = !this.isViewMode; // Only set edit mode if not in view mode
      this.policyId = +id;
      this.loadPolicy(this.policyId);
    }
  }

  initializeForm(): void {
    this.policyForm = this.formBuilder.group({
      planType: ['', [Validators.required]],
      tenure: ['', [Validators.required, Validators.min(1)]],
      premiumFrequency: ['', [Validators.required]],
      insuredAmount: ['', [Validators.required, Validators.min(0)]],
      issuanceDate: ['', [Validators.required]],
      maturityDate: ['', [Validators.required]],
      policyHolderName: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      incomeSource: ['', [Validators.required]],
      totalIncome: ['', [Validators.required, Validators.min(0)]],
      policyStatus: ['PENDING', [Validators.required]],
      nomineeName: ['', [Validators.required, Validators.minLength(3)]],
      nomineeContactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      nomineeDOB: ['', [Validators.required]],
      nomineeRelationship: ['', [Validators.required]]
    });
    
    // Disable policyStatus in create mode
    if (!this.isEditMode) {
      this.policyForm.get('policyStatus')?.disable();
    }
  }

  loadPolicy(id: number): void {
    this.policyService.getPolicyById(id).subscribe({
      next: (policy) => {
        // Enable policyStatus in edit mode (but not view mode)
        if (!this.isViewMode) {
          this.policyForm.get('policyStatus')?.enable();
        }
        this.policyForm.patchValue(policy);
        
        // Disable all form controls in view mode
        if (this.isViewMode) {
          this.policyForm.disable();
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load policy';
        console.error('Error loading policy:', error);
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.policyForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      // Mark all fields as touched to show validation errors
      Object.keys(this.policyForm.controls).forEach(key => {
        this.policyForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    // Use getRawValue() to include disabled fields
    const formValue = this.policyForm.getRawValue();

    if (this.isEditMode && this.policyId) {
      this.policyService.updatePolicy(this.policyId, formValue).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/policies']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to update policy';
          console.error('Error updating policy:', error);
        }
      });
    } else {
      const userId = this.authService.currentUserValue?.id;
      if (!userId) {
        this.loading = false;
        this.errorMessage = 'Please log in before issuing a policy';
        return;
      }
      this.policyService.createPolicy(formValue, userId).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/policies']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to create policy. ' + (error.error?.message || error.message || 'Please try again.');
          console.error('Error creating policy:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/policies']);
  }

  get f() {
    return this.policyForm.controls;
  }
}
