import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../../core/auth/auth.service';
import { StudentService, Student, CreateStudentRequest } from '../../../core/services/student.service';
import { CourseService, Course } from '../../../core/services/course.service';
import { CentreService } from '../../../core/services/centre.service';
import { UserService } from 'src/app/core/services/user.services';

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
  studentList: any[] = [];

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
  newStudent: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: 0,
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: 0,
    enrollmentDate: '',
    status: 'active',
    centerId: 0,
    userId: 0
  };

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private courseService: CourseService,
    private centreService: CentreService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isCentreAdmin()) {
      this.router.navigate(['/unauthorized']);
      return;
    }

    this.userService.getUserByCenterId(this.centreId!).subscribe({
      next: (userData: any) => {
        this.studentList = userData.data;
        console.log('User ID:', this.studentList);
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });

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
    console.log('Loading students for centre:', this.centreId);

    this.studentService.getStudentsByCentre(this.centreId!).subscribe({
      next: (response: any) => {
        // console.log('API Response:', response);
        // Handle different response structures
        if (response && response.data) {
          this.students = response.data;
          this.stats.totalStudents = this.students.length;
          this.stats.activeEnrolments = this.students.length;
          this.stats.completedCertifications = this.students.length;
        } else if (Array.isArray(response)) {
          this.students = response;
        } else {
          this.students = [];
        }
        // console.log('Students loaded:', this.students);
        
        this.recentStudents = this.students.slice(0, 5);
        this.loading.students = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        // For debugging - add some mock data to test the UI
        this.students = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            govtId: 'ID123456',
            dob: new Date('1990-01-01'),
            centreId: this.centreId || '',
            createdAt: new Date(),
            isActive: true
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '0987654321',
            govtId: 'ID789012',
            dob: new Date('1992-05-15'),
            centreId: this.centreId || '',
            createdAt: new Date(),
            isActive: true
          }
        ] as any[];
        console.log('Using mock data for testing:', this.students);
        this.loading.students = false;
      }
    });
  }

  loadCourses(): void {
    this.loading.courses = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses:any) => {
        console.log("courses ",courses.data);
        
        this.courses = courses.data.filter((c:any) => c.isPublished);
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
    this.stats.totalStudents
    // Additional stats would come from API calls
    this.loading.stats = false;
  }

  openAddStudentModal(): void {
    console.log('openAddStudentModal called');
    this.showAddStudentModal = true;
    console.log('showAddStudentModal set to:', this.showAddStudentModal);
    this.resetNewStudentForm();
    // Force change detection
    setTimeout(() => {
      console.log('Modal should be visible now');
    }, 100);
  }

  closeAddStudentModal(): void {
    this.showAddStudentModal = false;
    this.resetNewStudentForm();
  }

  resetNewStudentForm(): void {
    this.newStudent = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      enrollmentDate: '',
      status: 'active',
      centerId:this.centreId,
      userId: 0
    };
  }

  addStudent(): void {
    if (!this.centreId) return;
    console.log('Adding student:', this.newStudent);
    this.studentService.createStudent(this.newStudent).subscribe({
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
    if (confirm(`Are you sure you want to delete ${student.id}?`)) {
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
    this.studentService.enrollStudent(student.firstName, courseId).subscribe({
      next: () => {
        alert(`${student.firstName} enrolled successfully!`);
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
