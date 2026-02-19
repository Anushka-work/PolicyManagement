import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PolicyListComponent } from './components/policy-list/policy-list.component';
import { PolicyFormComponent } from './components/policy-form/policy-form.component';
import { ClaimListComponent } from './components/claim-list/claim-list.component';
import { ClaimFormComponent } from './components/claim-form/claim-form.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'policies', 
    component: PolicyListComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.USER, UserRole.APPROVER, UserRole.SUPERUSER, UserRole.READONLY] }
  },
  { 
    path: 'policies/new', 
    component: PolicyFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPERUSER] }
  },
  { 
    path: 'policies/edit/:id', 
    component: PolicyFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPERUSER] }
  },
  { 
    path: 'policies/view/:id', 
    component: PolicyFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.USER, UserRole.APPROVER, UserRole.SUPERUSER, UserRole.READONLY] }
  },
  { 
    path: 'claims', 
    component: ClaimListComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.USER, UserRole.APPROVER] }
  },
  { 
    path: 'claims/new', 
    component: ClaimFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.USER] }
  },
  { 
    path: 'claims/edit/:id', 
    component: ClaimFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.USER, UserRole.APPROVER] }
  },
  { 
    path: 'users', 
    component: UserManagementComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPERUSER] }
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
