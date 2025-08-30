import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about/about.component';
import { ContactComponent } from './pages/contact/contact/contact.component';
import { FaqComponent } from './pages/faq/faq.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { ForgotPasswordComponent } from './core/auth/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './core/auth/pagenotfound/pagenotfound.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/auth/auth.service';

const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  
  // Public certificate verification
  { 
    path: 'verify', 
    loadChildren: () => import('./features/certification/certification.module').then(m => m.CertificationModule) 
  },

  // Role-based protected routes
  {
    path: 'super-admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.SUPER_ADMIN },
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  
  {
    path: 'centre-admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.CENTRE_ADMIN },
    loadChildren: () => import('./features/centre/centre.module').then(m => m.CentreModule)
  },
  
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.STUDENT },
    loadChildren: () => import('./features/candidate/candidate.module').then(m => m.CandidateModule)
  },

  // Exam engine routes (accessible by students) - will be implemented in candidate module
  // {
  //   path: 'exam',
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: [UserRole.STUDENT] },
  //   loadChildren: () => import('./features/candidate/take-exam/take-exam.module').then(m => m.TakeExamModule)
  // },

  // Legacy redirects for backward compatibility
  { path: 'dashboard', redirectTo: '/student', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/super-admin', pathMatch: 'full' },
  { path: 'student-portal', redirectTo: '/student', pathMatch: 'full' },
  { path: 'institute-portal', redirectTo: '/centre-admin', pathMatch: 'full' },

  // Error pages
  { path: 'unauthorized', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
