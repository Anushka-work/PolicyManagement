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
  
  // Step management
  currentStep: number = 0;
  steps = [
    { label: 'Policy Information' },
    { label: 'Holder Information' },
    { label: 'Financial Details' },
    { label: 'Nominee Details' }
  ];

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

  // User selection for SUPERUSER
  users: any[] = [];
  loadingUsers: boolean = false;

  constructor(
    private policyService: PolicyService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // Check if we're in view mode based on the URL
    this.isViewMode = this.router.url.includes('/policies/view/');
    
    // Determine edit mode BEFORE initializing form
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = !this.isViewMode; // Only set edit mode if not in view mode
      this.policyId = +id;
    }
    
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
    
    // Load users if SUPERUSER and in create mode
    if (this.authService.isSuperUser() && !this.isEditMode && !this.isViewMode) {
      this.loadUsers();
    }
    
    // Load policy data if editing or viewing
    if (this.policyId) {
      this.loadPolicy(this.policyId);
    }
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        // Filter only ACTIVE users
        this.users = users
          .filter(user => user.status === 'ACTIVE')
          .map(user => ({
            label: `${user.username} (${user.email}) - ${user.role}`,
            value: user.id
          }));
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users';
        this.loadingUsers = false;
      }
    });
  }

  initializeForm(): void {
    this.policyForm = this.formBuilder.group({
      userId: ['', this.authService.isSuperUser() && !this.isEditMode ? [Validators.required] : []],
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
      premiumAmount: ['', [Validators.required, Validators.min(0)]],
      policyStatus: ['PENDING', [Validators.required]],
      nomineeName: ['', [Validators.required, Validators.minLength(3)]],
      nomineeContactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      nomineeDOB: ['', [Validators.required]],
      nomineeRelationship: ['', [Validators.required]],
      nomineePercentageStake: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
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
      // Remove userId from formValue as it's not part of Policy model
      const policyData = { ...formValue };
      delete policyData.userId;
      
      this.policyService.updatePolicy(this.policyId, policyData).subscribe({
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
      // Get userId from form if SUPERUSER selected one, otherwise use current user
      let userId = formValue.userId || this.authService.currentUserValue?.id;
      
      if (!userId) {
        this.loading = false;
        this.errorMessage = 'Please select a user or log in before issuing a policy';
        return;
      }
      
      // Remove userId from formValue as it's not part of Policy model
      const policyData = { ...formValue };
      delete policyData.userId;
      
      this.policyService.createPolicy(policyData, userId).subscribe({
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

  // Step navigation methods
  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
    } else {
      this.markStepFieldsAsTouched(this.currentStep);
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    const stepFields = this.getStepFields(step);
    return stepFields.every(field => {
      const control = this.policyForm.get(field);
      return control && control.valid;
    });
  }

  getStepFields(step: number): string[] {
    switch(step) {
      case 0: // Policy Information
        const step0Fields = ['planType', 'tenure', 'premiumFrequency', 'insuredAmount', 'issuanceDate', 'maturityDate'];
        // Add userId field for SUPERUSER in create mode
        if (this.authService.isSuperUser() && !this.isEditMode) {
          step0Fields.unshift('userId');
        }
        return step0Fields;
      case 1: // Holder Information
        return ['policyHolderName', 'dob', 'address', 'mobileNumber'];
      case 2: // Financial Details
        return ['incomeSource', 'totalIncome', 'premiumAmount'];
      case 3: // Nominee Details
        return ['nomineeName', 'nomineeContactNumber', 'nomineeDOB', 'nomineeRelationship', 'nomineePercentageStake'];
      default:
        return [];
    }
  }

  markStepFieldsAsTouched(step: number): void {
    const stepFields = this.getStepFields(step);
    stepFields.forEach(field => {
      this.policyForm.get(field)?.markAsTouched();
    });
  }

  get f() {
    return this.policyForm.controls;
  }
}
