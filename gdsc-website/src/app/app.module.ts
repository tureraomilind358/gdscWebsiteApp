import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Chart.js

import { ChartConfiguration, ChartType } from 'chart.js';
import { registerables } from 'chart.js';
import { Chart } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

// Components

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

// Page Components
import { HomeComponent } from './pages/home/home/home.component';
import { AboutComponent } from './pages/about/about/about.component';
import { ContactComponent } from './pages/contact/contact/contact.component';
import { FaqComponent } from './pages/faq/faq.component';

// Feature Components
import { ForInstitutesComponent } from './features/centre/centre-list/for-institutes/for-institutes.component';
import { ForStudentsComponent } from './features/candidate/exam-list/for-students/for-students.component';
import { StudentPortalComponent } from './features/candidate/profile/student-portal/student-portal.component';
import { InstitutePortalComponent } from './features/centre/centre-dashboard/institute-portal/institute-portal.component';
import { CertificatePreviewComponent } from './features/certification/generate-certificate/certificate-preview/certificate-preview.component';
import { DashboardComponent } from './features/candidate/profile/dashboard.component';

// Auth Components
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { PageNotFoundComponent } from './core/auth/pagenotfound/pagenotfound.component';

// Shared Components
import { NavbarComponent } from './shared/navbar/navbar.component';
// import { FooterComponent } from './shared/footer/footer/footer.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    // AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    FaqComponent,
    ForInstitutesComponent,
    ForStudentsComponent,
    StudentPortalComponent,
    InstitutePortalComponent,
    CertificatePreviewComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    // NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    // RouterModule,
    // NgChartsModule
  ],

})
export class AppModule { }
