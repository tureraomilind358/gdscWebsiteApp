import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { NgChartsModule } from 'ng2-charts';

import { CandidateRoutingModule } from './candidate-routing.module';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';

// Services
import { StudentService } from '../../core/services/student.service';
import { ExamService } from '../../core/services/exam.service';
import { CertificateService } from '../../core/services/certificate.service';
import { CourseService } from '../../core/services/course.service';

@NgModule({
  declarations: [
    StudentDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // NgChartsModule,
    CandidateRoutingModule
  ],
  providers: [
    StudentService,
    ExamService,
    CertificateService,
    CourseService
  ]
})
export class CandidateModule { }
