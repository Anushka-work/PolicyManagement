import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})
export class PolicyListComponent implements OnInit {
  policies: Policy[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private policyService: PolicyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.loading = true;
    this.policyService.getAllPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load policies';
        this.loading = false;
        console.error('Error loading policies:', error);
      }
    });
  }

  createPolicy(): void {
    this.router.navigate(['/policies/new']);
  }

  editPolicy(id: number): void {
    this.router.navigate(['/policies/edit', id]);
  }

  deletePolicy(id: number): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.policyService.deletePolicy(id).subscribe({
        next: () => {
          this.loadPolicies();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete policy';
          console.error('Error deleting policy:', error);
        }
      });
    }
  }
}
