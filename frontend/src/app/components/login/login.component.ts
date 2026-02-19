import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (this.authService.isLoggedIn()) {
      const currentUser = this.authService.currentUserValue;
      const userRole = currentUser?.role?.toLowerCase() || 'user';
      
      switch(userRole) {
        case 'admin':
          this.router.navigate(['/dashboard/admin']);
          break;
        case 'super-user':
        case 'superuser':
          this.router.navigate(['/dashboard/superuser']);
          break;
        case 'read-only':
        case 'readonly':
          this.router.navigate(['/dashboard/readonly']);
          break;
        case 'user':
        default:
          this.router.navigate(['/dashboard/user']);
          break;
      }
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Login successful';
        
        // Route based on user role
        const userRole = response.role?.toLowerCase() || 'user';
        switch(userRole) {
          case 'admin':
            this.router.navigate(['/dashboard/admin']);
            break;
          case 'super-user':
          case 'superuser':
            this.router.navigate(['/dashboard/superuser']);
            break;
          case 'read-only':
          case 'readonly':
            this.router.navigate(['/dashboard/readonly']);
            break;
          case 'user':
          default:
            this.router.navigate(['/dashboard/user']);
            break;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Invalid username or password';
        console.error('Login error:', error);
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  get f() {
    return this.loginForm.controls;
  }
}
