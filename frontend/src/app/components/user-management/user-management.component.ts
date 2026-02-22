import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        // Filter out SUPERUSER from the list as they are pre-existing and should not be managed
        this.users = data.filter(user => user.role !== 'SUPERUSER');
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  activateUser(userId: number): void {
    if (confirm('Are you sure you want to activate this user?')) {
      this.authService.activateUser(userId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User activated successfully' });
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to activate user' });
          console.error('Error activating user:', error);
        }
      });
    }
  }

  deactivateUser(userId: number): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.authService.deactivateUser(userId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deactivated successfully' });
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to deactivate user' });
          console.error('Error deactivating user:', error);
        }
      });
    }
  }

  isActive(user: User): boolean {
    return user.status === 'ACTIVE';
  }
}
