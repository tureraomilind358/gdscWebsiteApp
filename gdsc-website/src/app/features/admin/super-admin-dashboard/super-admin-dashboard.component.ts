import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../../core/auth/auth.service';
import { CentreService, Centre, CentreStatus } from '../../../core/services/centre.service';
import { StudentService, Student } from '../../../core/services/student.service';
import { CourseService, Course } from '../../../core/services/course.service';
import { CertificateService } from '../../../core/services/certificate.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  currentUser = this.authService.currentUserValue;
  
  // Dashboard statistics
  stats = {
    totalCentres: 0,
    pendingCentres: 0,
    approvedCentres: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalCertificates: 0
  };

  // Recent data
  recentCentres: Centre[] = [];
  recentStudents: Student[] = [];
  pendingApprovals: Centre[] = [];

  // Loading states
  loading = {
    stats: true,
    centres: true,
    students: true
  };

  constructor(
    private authService: AuthService,
    private centreService: CentreService,
    private studentService: StudentService,
    private courseService: CourseService,
    private certificateService: CertificateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isSuperAdmin()) {
      this.router.navigate(['/unauthorized']);
      return;
    }
    
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadStatistics();
    this.loadRecentCentres();
    this.loadRecentStudents();
    this.loadPendingApprovals();
  }

  loadStatistics(): void {
    this.loading.stats = true;
    
    // Load all centres
    this.centreService.getAllCentres().subscribe({
      next: (centres) => {
        this.stats.totalCentres = centres.length;
        this.stats.pendingCentres = centres.filter(c => c.status === CentreStatus.PENDING).length;
        this.stats.approvedCentres = centres.filter(c => c.status === CentreStatus.APPROVED).length;
      },
      error: (error) => console.error('Error loading centres:', error)
    });

    // Load all students
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.stats.totalStudents = students.length;
      },
      error: (error) => console.error('Error loading students:', error)
    });

    // Load all courses
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.stats.totalCourses = courses.length;
      },
      error: (error) => console.error('Error loading courses:', error)
    });

    // Load certificate statistics
    this.certificateService.getCertificateStatistics().subscribe({
      next: (certStats) => {
        this.stats.totalCertificates = certStats.total || 0;
        this.loading.stats = false;
      },
      error: (error) => {
        console.error('Error loading certificate stats:', error);
        this.loading.stats = false;
      }
    });
  }

  loadRecentCentres(): void {
    this.loading.centres = true;
    this.centreService.getAllCentres().subscribe({
      next: (centres) => {
        this.recentCentres = centres.slice(0, 5); // Get latest 5
        this.loading.centres = false;
      },
      error: (error) => {
        console.error('Error loading recent centres:', error);
        this.loading.centres = false;
      }
    });
  }

  loadRecentStudents(): void {
    this.loading.students = true;
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.recentStudents = students.slice(0, 5); // Get latest 5
        this.loading.students = false;
      },
      error: (error) => {
        console.error('Error loading recent students:', error);
        this.loading.students = false;
      }
    });
  }

  loadPendingApprovals(): void {
    this.centreService.getAllCentres(CentreStatus.PENDING).subscribe({
      next: (centres) => {
        this.pendingApprovals = centres;
      },
      error: (error) => console.error('Error loading pending approvals:', error)
    });
  }

  approveCentre(centreId: string): void {
    this.centreService.updateCentreStatus(centreId, CentreStatus.APPROVED).subscribe({
      next: () => {
        this.loadPendingApprovals();
        this.loadStatistics();
      },
      error: (error) => console.error('Error approving centre:', error)
    });
  }

  rejectCentre(centreId: string): void {
    this.centreService.updateCentreStatus(centreId, CentreStatus.REJECTED, 'Rejected by admin').subscribe({
      next: () => {
        this.loadPendingApprovals();
        this.loadStatistics();
      },
      error: (error) => console.error('Error rejecting centre:', error)
    });
  }

  navigateToManagement(section: string): void {
    this.router.navigate(['/super-admin', section]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
