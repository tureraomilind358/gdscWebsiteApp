import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../auth.service';
import { UserService } from '../../services/user.services';

interface AuthUser {
  username: string;
  token: string;
  roles: string[];
  role?: string; // Converted from roles array
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

onSubmit() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          this.isLoading = false;
          const role = response.data.roles[0];
          this.userService.getUserByUserName(username).subscribe(userResponse => {
            console.log('User Details:', userResponse);
            localStorage.setItem('currentUserData', JSON.stringify(userResponse));
          });
          this.redirectBasedOnRole(role);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}

private redirectBasedOnRole(role: string): void {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      this.router.navigate(['/admin']);
      break;
    case UserRole.CENTRE_ADMIN:  // This will now match 'ROLE_CENTER'
      this.router.navigate(['/centre-admin']);
      break;
    case UserRole.STUDENT:
      this.router.navigate(['/student']);
      break;
    default:
      console.log('Unrecognized role:', role); // For debugging
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
    if (control?.hasError('username')) {
      return 'Please enter a valid username address';
    }
    if (control?.hasError('minlength')) {
      return `Password must be at least 6 characters`;
    }
    return '';
  }
}
