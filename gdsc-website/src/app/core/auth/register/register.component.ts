import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { CentreService } from '../../services/centre.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  registrationType: 'center' | 'student' = 'center';
  
  // Location data
  states: string[] = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan',
    'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh', 'Haryana'
  ];
  
  genders: string[] = ['Male', 'Female', 'Other'];
  
  centers: any[] = [
    {
      "id": 1,
      "name": "Main Campus",
      "code": "MC001",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": null,
      "phone": "9967120080",
      "email": "main@institute.com",
      "capacity": 500,
      "status": "ACTIVE",
      "description": "Main campus with full facilities"
    },
    {
      "id": 2,
      "name": "Downtown Branch",
      "code": "DB002",
      "address": "456 Business Ave",
      "city": "New York",
      "state": "NY",
      "zipCode": null,
      "phone": "9967120080",
      "email": "downtown@institute.com",
      "capacity": 200,
      "status": "ACTIVE",
      "description": "Downtown location for working professionals"
    },
    {
      "id": 3,
      "name": "Milind Turerao",
      "code": "MILIN2025342",
      "address": "casa aurelia",
      "city": "thane",
      "state": "Maharashtra",
      "zipCode": "421204",
      "phone": null,
      "email": "tureraomilind358@gmail.com",
      "capacity": 100,
      "status": "ACTIVE",
      "description": "new center registaration"
    },
    {
      "id": 4,
      "name": "Milind Turerao",
      "code": "MILIN2025700",
      "address": "casa aurelia",
      "city": "thane",
      "state": "Maharashtra",
      "zipCode": "421204",
      "phone": null,
      "email": "tureraomilind8055@gmail.com",
      "capacity": 100,
      "status": "ACTIVE",
      "description": "qwERTY RTYU"
    }
  ]; // Will be populated from API
countries: any[] = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];; // Will be populated from API

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private centerService: CentreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.createCenterForm();
  }

  ngOnInit() {
    // Check route parameter to determine registration type
    this.route.queryParams.subscribe(params => {
      if (params['type'] === 'student') {
        this.registrationType = 'student';
        this.registerForm = this.createStudentForm();
      } else {
        this.registrationType = 'center';
        this.registerForm = this.createCenterForm();
      }
    });

  //   this.centerService.getAllCentres().subscribe(centres => {
  //     this.centers = [
  //   {
  //     "id": 1,
  //     "name": "Main Campus",
  //     "code": "MC001",
  //     "address": "123 Main Street",
  //     "city": "New York",
  //     "state": "NY",
  //     "zipCode": null,
  //     "phone": "9967120080",
  //     "email": "main@institute.com",
  //     "capacity": 500,
  //     "status": "ACTIVE",
  //     "description": "Main campus with full facilities"
  //   },
  //   {
  //     "id": 2,
  //     "name": "Downtown Branch",
  //     "code": "DB002",
  //     "address": "456 Business Ave",
  //     "city": "New York",
  //     "state": "NY",
  //     "zipCode": null,
  //     "phone": "9967120080",
  //     "email": "downtown@institute.com",
  //     "capacity": 200,
  //     "status": "ACTIVE",
  //     "description": "Downtown location for working professionals"
  //   },
  //   {
  //     "id": 3,
  //     "name": "Milind Turerao",
  //     "code": "MILIN2025342",
  //     "address": "casa aurelia",
  //     "city": "thane",
  //     "state": "Maharashtra",
  //     "zipCode": "421204",
  //     "phone": null,
  //     "email": "tureraomilind358@gmail.com",
  //     "capacity": 100,
  //     "status": "ACTIVE",
  //     "description": "new center registaration"
  //   },
  //   {
  //     "id": 4,
  //     "name": "Milind Turerao",
  //     "code": "MILIN2025700",
  //     "address": "casa aurelia",
  //     "city": "thane",
  //     "state": "Maharashtra",
  //     "zipCode": "421204",
  //     "phone": null,
  //     "email": "tureraomilind8055@gmail.com",
  //     "capacity": 100,
  //     "status": "ACTIVE",
  //     "description": "qwERTY RTYU"
  //   }
  // ];
  //   });
  }

  createCenterForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      country: ['India', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      capacity: [0, [Validators.required, Validators.min(1)]],
    }, { validators: this.passwordMatchValidator });
  }

  createStudentForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      centerId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // No role selection; registration is for Institutes only

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      let userData: any = { ...this.registerForm.value };
      
      // Remove form-specific fields
      delete userData.confirmPassword;
      delete userData.agreeToTerms;

      if (this.registrationType === 'center') {
        // Center registration - add default values
        userData.enrollmentDate = new Date().toISOString();
        userData.status = 'PENDING';
      } else {
        // Student registration - add default values
        userData.enrollmentDate = new Date().toISOString();
        userData.status = 'ACTIVE';
      }

      const endpoint = this.registrationType === 'center' ? 'centers/register' : 'student-register';
      
      this.authService.register(userData, endpoint).subscribe({
        next: (response) => {
          this.isLoading = false;
          const message = this.registrationType === 'center' 
            ? 'Center registration successful! Please wait for approval.' 
            : 'Student registration successful! Please log in.';
          this.router.navigate(['/login'], { 
            queryParams: { message }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  switchRegistrationType(type: 'center' | 'student') {
    this.registrationType = type;
    if (type === 'student') {
      this.registerForm = this.createStudentForm();
    } else {
      this.registerForm = this.createCenterForm();
    }
    this.errorMessage = '';
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('pattern') && field === 'mobile') {
      return 'Enter a valid 10-digit mobile number';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${minLength} characters`;
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
