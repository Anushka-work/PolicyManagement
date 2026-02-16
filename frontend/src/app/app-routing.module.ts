import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PolicyListComponent } from './components/policy-list/policy-list.component';
import { PolicyFormComponent } from './components/policy-form/policy-form.component';
import { ClaimListComponent } from './components/claim-list/claim-list.component';
import { ClaimFormComponent } from './components/claim-form/claim-form.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'policies', component: PolicyListComponent, canActivate: [AuthGuard] },
  { path: 'policies/new', component: PolicyFormComponent, canActivate: [AuthGuard] },
  { path: 'policies/edit/:id', component: PolicyFormComponent, canActivate: [AuthGuard] },
  { path: 'claims', component: ClaimListComponent, canActivate: [AuthGuard] },
  { path: 'claims/new', component: ClaimFormComponent, canActivate: [AuthGuard] },
  { path: 'claims/edit/:id', component: ClaimFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
