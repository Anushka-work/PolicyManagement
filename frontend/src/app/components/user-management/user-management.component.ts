import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  activateUser(userId: number): void {
    if (confirm('Are you sure you want to activate this user?')) {
      this.authService.activateUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error activating user:', error);
        }
      });
    }
  }

  deactivateUser(userId: number): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.authService.deactivateUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deactivating user:', error);
        }
      });
    }
  }

  getRoleBadgeClass(role: string): string {
    switch(role) {
      case 'SUPERUSER': return 'role-badge superuser';
      case 'APPROVER': return 'role-badge approver';
      case 'USER': return 'role-badge user';
      case 'READONLY': return 'role-badge readonly';
      default: return 'role-badge';
    }
  }

  getStatusBadgeClass(status: string): string {
    return status === 'ACTIVE' ? 'status-badge active' : 'status-badge inactive';
  }

  isActive(user: User): boolean {
    return user.status === 'ACTIVE';
  }
}
