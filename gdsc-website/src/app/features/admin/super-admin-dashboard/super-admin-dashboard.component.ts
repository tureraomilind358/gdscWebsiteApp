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
    pendingCenters: 0,
    approvedCenters: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalCertificates: 0
  };

  // Recent data
  recentCenters: Centre[] = [];
  recentStudents: Student[] = [];
  pendingApprovals: Centre[] = [];

  // Loading states
  loading = {
    stats: true,
    centers: true,
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
    
    // Load all centers
    this.centreService.getAllCentres().subscribe({
      next: (centers:any) => {
        this.stats.totalCentres = centers.data.length;
        this.stats.pendingCenters = centers.data.filter((c:any) => c.status === CentreStatus.INACTIVE).length;
        this.stats.approvedCenters = centers.data.filter((c:any) => c.status === CentreStatus.ACTIVE).length;
      },
      error: (error) => console.error('Error loading centers:', error)
    });

    // Load all students
    this.studentService.getAllStudents().subscribe({
      next: (students:any) => {
        this.stats.totalStudents = students.data.length;
      },
      error: (error) => console.error('Error loading students:', error)
    });

    // Load all courses
    this.courseService.getAllCourses().subscribe({
      next: (courses:any) => {
        console.log(courses.data);
        this.stats.totalCourses = courses.data.length;
        
      },
      error: (error) => console.error('Error loading courses:', error)
    });

    // Load certificate statistics
    this.certificateService.getCertificateStatistics().subscribe({
      next: (certStats:any) => {
        this.stats.totalCertificates = certStats.data.total || 0;
        this.loading.stats = false;
      },
      error: (error) => {
        console.error('Error loading certificate stats:', error);
        this.loading.stats = false;
      }
    });
  }

  loadRecentCentres(): void {
    this.loading.centers = true;
    this.centreService.getAllCentres().subscribe({
      next: (centers:any) => {
        this.recentCenters = centers.data.slice(0, 5); // Get latest 5
        this.loading.centers = false;
      },
      error: (error) => {
        console.error('Error loading recent centers:', error);
        this.loading.centers = false;
      }
    });
  }

  loadRecentStudents(): void {
    this.loading.students = true;
    this.studentService.getAllStudents().subscribe({
      next: (students:any) => {
        console.log(students.data);
        
        this.recentStudents = students.data.slice(0, 5); // Get latest 5
        this.loading.students = false;
      },
      error: (error) => {
        console.error('Error loading recent students:', error);
        this.loading.students = false;
      }
    });
  }

  loadPendingApprovals(): void {
    this.centreService.getAllCentres(CentreStatus.INACTIVE).subscribe({
      next: (centers:any) => {
        this.pendingApprovals = centers.data;
        console.log(this.pendingApprovals);
        
      },
      error: (error) => console.error('Error loading pending approvals:', error)
    });
  }

  approveCentre(centreId: string): void {
    this.centreService.updateCentreStatus(centreId, CentreStatus.ACTIVE).subscribe({
      next: () => {
        this.loadPendingApprovals();
        this.loadStatistics();
      },
      error: (error) => console.error('Error approving centre:', error)
    });
  }

  rejectCentre(centreId: string): void {
    this.centreService.updateCentreStatus(centreId, CentreStatus.INACTIVE, 'Rejected by admin').subscribe({
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
