import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CertificationRoutingModule } from './certification-routing.module';
import { VerifyCertificateComponent } from './verify-certificate/verify-certificate.component';

@NgModule({
  declarations: [
    VerifyCertificateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CertificationRoutingModule
  ]
})
export class CertificationModule { }
