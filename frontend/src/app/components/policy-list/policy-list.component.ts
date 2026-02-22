import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { Policy } from '../../models/policy.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})
export class PolicyListComponent implements OnInit {
  policies: Policy[] = [];
  loading: boolean = false;

  constructor(
    private policyService: PolicyService,
    private router: Router,
    public authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.loading = true;
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser || !currentUser.id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not authenticated' });
      this.loading = false;
      return;
    }

    // Superusers can see all policies, regular users see only their own
    const policiesObservable = this.authService.isSuperUser() 
      ? this.policyService.getAllPolicies()
      : this.policyService.getPoliciesByUser(currentUser.id);

    policiesObservable.subscribe({
      next: (policies) => {
        this.policies = policies;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load policies' });
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
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Policy deleted successfully' });
          this.loadPolicies();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete policy' });
          console.error('Error deleting policy:', error);
        }
      });
    }
  }

  viewPolicy(id: number): void {
    this.router.navigate(['/policies/view', id]);
  }
}
