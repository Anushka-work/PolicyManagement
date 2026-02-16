import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css']
})
export class PolicyFormComponent implements OnInit {
  policy: Policy = {
    planType: '',
    tenure: undefined,
    premiumFrequency: '',
    insuredAmount: undefined,
    issuanceDate: '',
    maturityDate: '',
    policyHolderName: '',
    dob: '',
    address: '',
    mobileNumber: '',
    incomeSource: '',
    totalIncome: undefined,
    policyStatus: 'PENDING_APPROVAL',
    nomineeName: '',
    nomineeContactNumber: '',
    nomineeDOB: '',
    nomineeRelationship: ''
  };

  isEditMode: boolean = false;
  policyId: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  planTypes = ['BASIC', 'STANDARD', 'PREMIUM', 'GOLD'];
  premiumFrequencies = ['monthly', 'quarterly', 'yearly'];
  statusOptions = ['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL'];
  nomineeRelationships = ['SPOUSE', 'PARENT', 'CHILD', 'SIBLING', 'OTHER'];

  constructor(
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.policyId = +id;
      this.loadPolicy(this.policyId);
    }
  }

  loadPolicy(id: number): void {
    this.policyService.getPolicyById(id).subscribe({
      next: (policy) => {
        this.policy = policy;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load policy';
        console.error('Error loading policy:', error);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.policyId) {
      this.policyService.updatePolicy(this.policyId, this.policy).subscribe({
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
      this.policyService.createPolicy(this.policy, userId).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/policies']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to create policy';
          console.error('Error creating policy:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/policies']);
  }
}
