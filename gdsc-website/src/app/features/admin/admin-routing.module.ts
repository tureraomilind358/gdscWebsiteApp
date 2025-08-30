import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageCentresComponent } from './manage-centres/manage-centres.component';
import { ManageExamsComponent } from './manage-exams/manage-exams.component';

const routes: Routes = [
  { path: '', component: SuperAdminDashboardComponent },
  { path: 'dashboard', component: SuperAdminDashboardComponent },
  { path: 'users', component: ManageUsersComponent },
  { path: 'centres', component: ManageCentresComponent },
  { path: 'exams', component: ManageExamsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
