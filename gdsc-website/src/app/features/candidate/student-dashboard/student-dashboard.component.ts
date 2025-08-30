import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../../core/auth/auth.service';
import { StudentService, Student, Enrolment } from '../../../core/services/student.service';
import { ExamService, ExamAttempt } from '../../../core/services/exam.service';
import { CertificateService, Certificate } from '../../../core/services/certificate.service';
import { CourseService, Course, Exam } from '../../../core/services/course.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser = this.authService.currentUserValue;
  studentId = this.currentUser?.id;
  
  // Dashboard data
  student: Student | null = null;
  enrolments: Enrolment[] = [];
  availableExams: Exam[] = [];
  examAttempts: ExamAttempt[] = [];
  certificates: Certificate[] = [];
  
  // Statistics
  stats = {
    totalEnrolments: 0,
    completedExams: 0,
    pendingExams: 0,
    certificatesEarned: 0,
    certificatesPending: 0,
    overallProgress: 0
  };

  // UI state
  loading = {
    profile: true,
    enrolments: true,
    exams: true,
    certificates: true
  };

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private examService: ExamService,
    private certificateService: CertificateService,
    private courseService: CourseService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }
    this.studentId = this.authService.currentUserValue.id;
  }

  ngOnInit(): void {
    if (!this.authService.isStudent()) {
      this.router.navigate(['/unauthorized']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loadStudentProfile();
    this.loadEnrolments();
    this.loadExamAttempts();
    this.loadCertificates();
  }

  loadStudentProfile(): void {
    this.loading.profile = true;
    this.studentService.getStudentById(this.studentId!).subscribe({
      next: (student) => {
        this.student = student;
        this.loading.profile = false;
      },
      error: (error) => {
        console.error('Error loading student profile:', error);
        this.loading.profile = false;
      }
    });
  }

  loadEnrolments(): void {
    this.loading.enrolments = true;
    this.studentService.getStudentEnrolments(this.studentId!).subscribe({
      next: (enrolments) => {
        this.enrolments = enrolments;
        this.loadAvailableExams();
        this.calculateStats();
        this.loading.enrolments = false;
      },
      error: (error) => {
        console.error('Error loading enrolments:', error);
        this.loading.enrolments = false;
      }
    });
  }

  loadAvailableExams(): void {
    this.loading.exams = true;
    // Load exams for enrolled courses
    const courseIds = this.enrolments.map(e => e.courseId);
    
    this.courseService.getAllExams().subscribe({
      next: (exams) => {
        this.availableExams = exams.filter(exam => 
          courseIds.includes(exam.courseId) && exam.isActive
        );
        this.loading.exams = false;
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.loading.exams = false;
      }
    });
  }

  loadExamAttempts(): void {
    this.examService.getStudentAttempts(this.studentId!).subscribe({
      next: (attempts) => {
        this.examAttempts = attempts;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading exam attempts:', error);
      }
    });
  }

  loadCertificates(): void {
    this.loading.certificates = true;
    this.certificateService.getStudentCertificates(this.studentId!).subscribe({
      next: (certificates) => {
        this.certificates = certificates.filter(c => !c.revoked);
        this.calculateStats();
        this.loading.certificates = false;
      },
      error: (error) => {
        console.error('Error loading certificates:', error);
        this.loading.certificates = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalEnrolments = this.enrolments.length;
    this.stats.completedExams = this.examAttempts.filter(a => a.status === 'GRADED').length;
    this.stats.pendingExams = this.availableExams.length - this.examAttempts.length;
    this.stats.certificatesEarned = this.certificates.length;
  }

  // Exam Actions
  startExam(exam: Exam): void {
    // Check if student has already attempted this exam
    const existingAttempt = this.examAttempts.find(a => a.examId === exam.id);
    
    if (existingAttempt && existingAttempt.status !== 'EXPIRED') {
      if (existingAttempt.status === 'STARTED') {
        // Resume existing attempt
        this.router.navigate(['/student/exam', existingAttempt.id]);
      } else {
        alert('You have already completed this exam.');
      }
      return;
    }

    // Start new exam attempt
    this.examService.startExamAttempt(exam.id).subscribe({
      next: (attempt) => {
        this.router.navigate(['/student/exam', attempt.id]);
      },
      error: (error) => {
        console.error('Error starting exam:', error);
        alert('Error starting exam. Please try again.');
      }
    });
  }

  viewExamResult(attempt: ExamAttempt): void {
    this.router.navigate(['/student/results', attempt.id]);
  }

  downloadCertificate(certificate: Certificate): void {
    this.certificateService.downloadCertificate(certificate.certNo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `certificate-${certificate.certNo}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading certificate:', error);
        alert('Error downloading certificate. Please try again.');
      }
    });
  }

  getExamStatus(exam: Exam): string {
    const attempt = this.examAttempts.find(a => a.examId === exam.id);
    if (!attempt) return 'Not Attempted';
    
    switch (attempt.status) {
      case 'STARTED': return 'In Progress';
      case 'SUBMITTED': return 'Under Review';
      case 'GRADED': return attempt && attempt.score !== undefined && attempt.score >= exam.passingMarks ? 'Passed' : 'Failed';
      case 'EXPIRED': return 'Expired';
      default: return 'Unknown';
    }
  }

  getExamStatusClass(exam: Exam): string {
    const status = this.getExamStatus(exam);
    switch (status) {
      case 'Not Attempted': return 'not-attempted';
      case 'In Progress': return 'in-progress';
      case 'Under Review': return 'under-review';
      case 'Passed': return 'passed';
      case 'Failed': return 'failed';
      case 'Expired': return 'expired';
      default: return '';
    }
  }

  getEnrolmentProgress(enrolment: Enrolment): number {
    // Calculate progress based on completed exams for this course
    const courseExams = this.availableExams.filter(e => e.courseId === enrolment.courseId);
    const completedExams = this.examAttempts.filter(a => 
      courseExams.some(e => e.id === a.examId) && a.status === 'GRADED'
    );
    
    if (courseExams.length === 0) return 0;
    return Math.round((completedExams.length / courseExams.length) * 100);
  }

  getExamAttempts(examId: string): number {
    return this.examAttempts.filter(a => a.examId === examId).length;
  }

  canStartExam(exam: Exam): boolean {
    const attempt = this.examAttempts.find(a => a.examId === exam.id);
    return !attempt || attempt.status === 'EXPIRED';
  }

  resumeExam(exam: Exam): void {
    this.router.navigate(['/student/exam', exam.id, 'resume']);
  }

  // Navigation
  navigateToSection(section: string): void {
    this.router.navigate(['/student', section]);
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
