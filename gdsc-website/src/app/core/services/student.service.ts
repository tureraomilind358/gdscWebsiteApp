import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  govtId: string;
  centreId: string;
  centreName?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateStudentRequest {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  govtId: string;
  password?: string;
}

export interface BulkImportResult {
  totalRecords: number;
  successCount: number;
  failureCount: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

export interface Enrolment {
  id: string;
  studentId: string;
  centreId: string;
  courseId: string;
  courseName: string;
  enrolledOn: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  // Centre Admin: Get students for their centre
  getStudentsByCentre(centreId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}?centreId=${centreId}`);
  }

  // Super Admin: Get all students
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // Get student by ID
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // Centre Admin: Create new student
  createStudent(centreId: string, studentData: CreateStudentRequest): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}`, { ...studentData, centreId });
  }

  // Centre Admin: Bulk import students
  bulkImportStudents(centreId: string, file: File): Observable<BulkImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('centreId', centreId);
    return this.http.post<BulkImportResult>(`${this.apiUrl}/bulk-import`, formData);
  }

  // Update student
  updateStudent(id: string, studentData: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, studentData);
  }

  // Delete student
  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Enrolment management
  enrollStudent(studentId: string, courseId: string): Observable<Enrolment> {
    return this.http.post<Enrolment>(`${this.apiUrl}/${studentId}/enrolments`, { courseId });
  }

  getStudentEnrolments(studentId: string): Observable<Enrolment[]> {
    return this.http.get<Enrolment[]>(`${this.apiUrl}/${studentId}/enrolments`);
  }

  cancelEnrolment(studentId: string, enrolmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${studentId}/enrolments/${enrolmentId}`);
  }

  // Generate hall ticket
  generateHallTicket(studentId: string, examId: string): Observable<{ pdfUrl: string }> {
    return this.http.post<{ pdfUrl: string }>(`${this.apiUrl}/${studentId}/hall-ticket`, { examId });
  }

  // Get student results
  getStudentResults(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${studentId}/results`);
  }
}
