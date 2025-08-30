import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyCertificateComponent } from './verify-certificate/verify-certificate.component';

const routes: Routes = [
  { path: 'verify', component: VerifyCertificateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificationRoutingModule { }
