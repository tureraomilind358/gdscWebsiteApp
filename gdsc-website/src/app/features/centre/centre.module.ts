import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CentreRoutingModule } from './centre-routing.module';
import { CentreAdminDashboardComponent } from './centre-admin-dashboard/centre-admin-dashboard.component';

@NgModule({
  declarations: [
    CentreAdminDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CentreRoutingModule
  ]
})
export class CentreModule { }
