import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExamAttempt {
  id: string;
  studentId: string;
  examPaperId: string;
  examId: string;
  startTime: Date;
  endTime?: Date;
  score?: number;
  status: 'STARTED' | 'SUBMITTED' | 'GRADED' | 'EXPIRED';
  proctoringFlags: any;
  answers: Answer[];
}

export interface Answer {
  id: string;
  attemptId: string;
  questionId: string;
  response: string;
  marksAwarded?: number;
  isCorrect?: boolean;
}

export interface ExamSession {
  attemptId: string;
  remainingTime: number;
  questions: any[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  // Start exam attempt
  startExamAttempt(examId: string): Observable<ExamAttempt> {
    return this.http.post<ExamAttempt>(`${this.apiUrl}/${examId}/attempts`, {});
  }

  // Get exam attempt details
  getExamAttempt(attemptId: string): Observable<ExamAttempt> {
    return this.http.get<ExamAttempt>(`${environment.apiUrl}/attempts/${attemptId}`);
  }

  // Get exam session (questions + current state)
  getExamSession(attemptId: string): Observable<ExamSession> {
    return this.http.get<ExamSession>(`${environment.apiUrl}/attempts/${attemptId}/session`);
  }

  // Save answer (auto-save)
  saveAnswer(attemptId: string, questionId: string, response: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/attempts/${attemptId}/answers`, {
      questionId,
      response
    });
  }

  // Submit exam
  submitExam(attemptId: string): Observable<ExamAttempt> {
    return this.http.post<ExamAttempt>(`${environment.apiUrl}/attempts/${attemptId}/submit`, {});
  }

  // Get student's exam attempts
  getStudentAttempts(studentId: string): Observable<ExamAttempt[]> {
    return this.http.get<ExamAttempt[]>(`${environment.apiUrl}/students/${studentId}/attempts`);
  }

  // Admin: Get all attempts for an exam
  getExamAttempts(examId: string): Observable<ExamAttempt[]> {
    return this.http.get<ExamAttempt[]>(`${this.apiUrl}/${examId}/attempts`);
  }

  // Manual grading for descriptive questions
  gradeAnswer(attemptId: string, questionId: string, marks: number, feedback?: string): Observable<Answer> {
    return this.http.patch<Answer>(`${environment.apiUrl}/attempts/${attemptId}/answers/${questionId}`, {
      marksAwarded: marks,
      feedback
    });
  }

  // Proctoring functions
  recordProctoringEvent(attemptId: string, event: any): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/attempts/${attemptId}/proctoring`, event);
  }

  // Get exam statistics
  getExamStatistics(examId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${examId}/statistics`);
  }
}
