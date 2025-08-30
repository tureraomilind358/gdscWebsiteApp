import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

interface DemoUser {
  id: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'CENTRE_ADMIN' | 'STUDENT';
  firstName: string;
  lastName: string;
  centreId?: string;
  centreName?: string;
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  // Static demo credentials for different roles
  private demoUsers: DemoUser[] = [
    {
      id: '1',
      username: 'superadmin',
      email: 'superadmin@gdsc.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'SUPER_ADMIN',
      firstName: 'Super',
      lastName: 'Admin',
      token: 'mock-super-admin-token'
    },
    {
      id: '2',
      username: 'centreadmin',
      email: 'centreadmin@gdsc.com',
      password: 'centre123',
      phone: '9876543211',
      role: 'CENTRE_ADMIN',
      firstName: 'Centre',
      lastName: 'Admin',
      centreId: 'CTR001',
      centreName: 'Mumbai Centre',
      token: 'mock-centre-admin-token'
    },
    {
      id: '3',
      username: 'student',
      email: 'student@gdsc.com',
      password: 'student123',
      phone: '9876543212',
      role: 'STUDENT',
      firstName: 'John',
      lastName: 'Doe',
      token: 'mock-student-token'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      // Find matching user from demo credentials
      const authenticatedUser = this.demoUsers.find(
        user => user.email === email && user.password === password
      );

      // Simulate API delay
      setTimeout(() => {
        if (authenticatedUser) {
          // Remove password from stored user data
          const { password: _, ...userWithoutPassword } = authenticatedUser;
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          this.isLoading = false;
          this.redirectBasedOnRole(authenticatedUser);
        } else {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password. Please check demo credentials.';
        }
      }, 1000);
    }
  }

  private redirectBasedOnRole(user: any): void {
    // Update auth service with the new user
    this.authService.setCurrentUser(user);
    
    switch (user.role) {
      case 'SUPER_ADMIN':
        this.router.navigate(['/super-admin']).then(() => {
          window.location.reload(); // Force reload to update navbar
        });
        break;
      case 'CENTRE_ADMIN':
        this.router.navigate(['/centre-admin']).then(() => {
          window.location.reload();
        });
        break;
      case 'STUDENT':
        this.router.navigate(['/student']).then(() => {
          window.location.reload();
        });
        break;
      default:
        this.router.navigate(['/unauthorized']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `Password must be at least 6 characters`;
    }
    return '';
  }
}
