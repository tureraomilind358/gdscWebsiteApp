import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateService } from '../../../core/services/certificate.service';

@Component({
  selector: 'app-certificate-verification',
  templateUrl: './certificate-verification.component.html',
  styleUrls: ['./certificate-verification.component.css']
})
export class CertificateVerificationComponent implements OnInit {
  verificationForm: FormGroup;
  isLoading = false;
  verificationResult: any = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService
  ) {
    this.verificationForm = this.fb.group({
      certificateId: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.verificationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.verificationResult = null;

      const { certificateId } = this.verificationForm.value;

      this.certificateService.verifyCertificate(certificateId).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.verificationResult = result;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Verification failed. Please check your details.';
        }
      });
    }
  }

  reset(): void {
    this.verificationForm.reset();
    this.verificationResult = null;
    this.errorMessage = '';
  }

  getErrorMessage(field: string): string {
    const control = this.verificationForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${minLength} characters`;
    }
    return '';
  }
}
