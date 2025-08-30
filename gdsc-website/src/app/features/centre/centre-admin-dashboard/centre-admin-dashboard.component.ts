import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../../core/auth/auth.service';
import { StudentService, Student, CreateStudentRequest } from '../../../core/services/student.service';
import { CourseService, Course } from '../../../core/services/course.service';
import { CentreService } from '../../../core/services/centre.service';

@Component({
  selector: 'app-centre-admin-dashboard',
  templateUrl: './centre-admin-dashboard.component.html',
  styleUrls: ['./centre-admin-dashboard.component.css']
})
export class CentreAdminDashboardComponent implements OnInit {
  currentUser = this.authService.currentUserValue;
  centreId = this.authService.getCurrentCentreId();
  
  // Dashboard data
  students: Student[] = [];
  courses: Course[] = [];
  recentStudents: Student[] = [];
  
  // Statistics
  stats = {
    totalStudents: 0,
    activeEnrolments: 0,
    completedCertifications: 0,
    pendingExams: 0
  };

  // UI state
  loading = {
    students: true,
    courses: true,
    stats: true
  };

  showAddStudentModal = false;
  showBulkImportModal = false;
  selectedFile: File | null = null;

  // New student form
  newStudent: CreateStudentRequest = {
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    govtId: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private courseService: CourseService,
    private centreService: CentreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isCentreAdmin()) {
      this.router.navigate(['/unauthorized']);
      return;
    }

    if (!this.centreId) {
      console.error('Centre ID not found for centre admin');
      this.router.navigate(['/unauthorized']);
      return;
    }
    
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadStudents();
    this.loadCourses();
    this.loadStatistics();
  }

  loadStudents(): void {
    this.loading.students = true;
    this.studentService.getStudentsByCentre(this.centreId!).subscribe({
      next: (students) => {
        this.students = students;
        this.recentStudents = students.slice(0, 5);
        this.loading.students = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading.students = false;
      }
    });
  }

  loadCourses(): void {
    this.loading.courses = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses.filter(c => c.isActive);
        this.loading.courses = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading.courses = false;
      }
    });
  }

  loadStatistics(): void {
    this.loading.stats = true;
    // Calculate statistics from loaded data
    this.stats.totalStudents = this.students.length;
    // Additional stats would come from API calls
    this.loading.stats = false;
  }

  // Student Management
  openAddStudentModal(): void {
    this.showAddStudentModal = true;
    this.resetNewStudentForm();
  }

  closeAddStudentModal(): void {
    this.showAddStudentModal = false;
    this.resetNewStudentForm();
  }

  resetNewStudentForm(): void {
    this.newStudent = {
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      govtId: '',
      password: ''
    };
  }

  addStudent(): void {
    if (!this.centreId) return;

    this.studentService.createStudent(this.centreId, this.newStudent).subscribe({
      next: (student) => {
        this.students.unshift(student);
        this.loadStatistics();
        this.closeAddStudentModal();
        alert('Student added successfully!');
      },
      error: (error) => {
        console.error('Error adding student:', error);
        alert('Error adding student. Please try again.');
      }
    });
  }

  // Bulk Import
  openBulkImportModal(): void {
    this.showBulkImportModal = true;
  }

  closeBulkImportModal(): void {
    this.showBulkImportModal = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
      this.selectedFile = file;
    } else {
      alert('Please select a valid CSV or Excel file.');
    }
  }

  uploadBulkStudents(): void {
    if (!this.selectedFile || !this.centreId) return;

    this.studentService.bulkImportStudents(this.centreId, this.selectedFile).subscribe({
      next: (result) => {
        alert(`Import completed! ${result.successCount} students added, ${result.failureCount} failed.`);
        this.loadStudents();
        this.closeBulkImportModal();
      },
      error: (error) => {
        console.error('Error importing students:', error);
        alert('Error importing students. Please try again.');
      }
    });
  }

  // Student Actions
  editStudent(student: Student): void {
    this.router.navigate(['/centre-admin/students', student.id, 'edit']);
  }

  deleteStudent(student: Student): void {
    if (confirm(`Are you sure you want to delete ${student.fullName}?`)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.students = this.students.filter(s => s.id !== student.id);
          this.loadStatistics();
          alert('Student deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Error deleting student. Please try again.');
        }
      });
    }
  }

  enrollStudent(student: Student, courseId: string): void {
    this.studentService.enrollStudent(student.id, courseId).subscribe({
      next: () => {
        alert(`${student.fullName} enrolled successfully!`);
        this.loadStatistics();
      },
      error: (error) => {
        console.error('Error enrolling student:', error);
        alert('Error enrolling student. Please try again.');
      }
    });
  }

  // Navigation
  navigateToSection(section: string): void {
    this.router.navigate(['/centre-admin', section]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
