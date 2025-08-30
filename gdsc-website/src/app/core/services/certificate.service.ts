import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Certificate {
  id: string;
  certNo: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  examAttemptId: string;
  issueDate: Date;
  grade: string;
  pdfUrl: string;
  qrCodeUrl: string;
  hash: string;
  revoked: boolean;
  revokedAt?: Date;
  revokedReason?: string;
}

export interface CertificateVerification {
  isValid: boolean;
  certificate?: Certificate;
  verifiedAt: Date;
  sourceIp: string;
  method: 'QR' | 'SITE' | 'API';
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = `${environment.apiUrl}/certificates`;

  constructor(private http: HttpClient) {}

  // Issue certificate (internal - triggered after exam pass)
  issueCertificate(examAttemptId: string): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.apiUrl}/issue`, { examAttemptId });
  }

  // Get certificate by ID
  getCertificateById(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  }

  // Get certificate by certificate number
  getCertificateByCertNo(certNo: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/cert/${certNo}`);
  }

  // Get student's certificates
  getStudentCertificates(studentId: string): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/student/${studentId}`);
  }

  // Get centre's certificates
  getCentreCertificates(centreId: string): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/centre/${centreId}`);
  }

  // Admin: Get all certificates
  getAllCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  // Public certificate verification
  verifyCertificate(certNo: string): Observable<CertificateVerification> {
    return this.http.get<CertificateVerification>(`${environment.apiUrl}/verify`, {
      params: { cert_no: certNo }
    });
  }

  // Verify certificate by QR code
  verifyCertificateByQR(qrData: string): Observable<CertificateVerification> {
    return this.http.post<CertificateVerification>(`${environment.apiUrl}/verify/qr`, { qrData });
  }

  // Admin: Revoke certificate
  revokeCertificate(id: string, reason: string): Observable<Certificate> {
    return this.http.patch<Certificate>(`${this.apiUrl}/${id}/revoke`, { reason });
  }

  // Admin: Restore revoked certificate
  restoreCertificate(id: string): Observable<Certificate> {
    return this.http.patch<Certificate>(`${this.apiUrl}/${id}/restore`, {});
  }

  // Download certificate PDF
  downloadCertificate(certNo: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${certNo}`, {
      responseType: 'blob'
    });
  }

  // Get certificate statistics
  getCertificateStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }

  // Bulk certificate generation
  bulkGenerateCertificates(examId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bulk-generate`, { examId });
  }
}
