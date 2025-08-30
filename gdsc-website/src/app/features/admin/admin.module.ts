import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageCentresComponent } from './manage-centres/manage-centres.component';
import { ManageExamsComponent } from './manage-exams/manage-exams.component';

@NgModule({
  declarations: [
    SuperAdminDashboardComponent,
    ManageUsersComponent,
    ManageCentresComponent,
    ManageExamsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
