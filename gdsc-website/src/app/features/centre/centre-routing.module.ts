import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentreAdminDashboardComponent } from './centre-admin-dashboard/centre-admin-dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: CentreAdminDashboardComponent },
  { path: 'dashboard', component: CentreAdminDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentreRoutingModule { }
