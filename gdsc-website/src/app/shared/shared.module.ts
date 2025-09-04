import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Shared Components
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { CardComponent } from './card/card.component';
import { HeroBannerComponent } from './card/hero-banner/hero-banner.component';
import { ProcessSectionComponent } from './card/process-section/process-section.component';
import { TestimonialsComponent } from './card/testimonials/testimonials.component';
import { TrustStatsComponent } from './card/trust-stats/trust-stats.component';
import { CertificateVerificationComponent } from './components/certificate-verification/certificate-verification.component';





@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    CardComponent,
    HeroBannerComponent,
    TrustStatsComponent,
    ProcessSectionComponent,
    TestimonialsComponent,
    CertificateVerificationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    HeroBannerComponent,
    TestimonialsComponent,
    TrustStatsComponent,
    ProcessSectionComponent,
    CertificateVerificationComponent,
  ]
})
export class SharedModule { }
