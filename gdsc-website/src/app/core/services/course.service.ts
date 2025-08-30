import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  durationHours: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isActive: boolean;
  createdAt: Date;
}

export interface Question {
  id: string;
  courseId: string;
  type: 'MCQ' | 'DESCRIPTIVE' | 'PRACTICAL';
  prompt: string;
  options?: string[];
  correctKey?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  marks: number;
  tags: string[];
}

export interface Exam {
  id: string;
  courseId: string;
  name: string;
  title: string;
  description: string;
  instructions: string;
  timeLimit: number;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  passingScore: number;
  totalQuestions: number;
  maxAttempts: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamPaper {
  id: string;
  examId: string;
  blueprint: {
    sections: Array<{
      name: string;
      questionCount: number;
      difficultyMix: Record<number, number>;
    }>;
  };
  questionIds: string[];
  generatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  // Course Management
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(courseData: Omit<Course, 'id' | 'createdAt'>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, courseData);
  }

  updateCourse(id: string, courseData: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, courseData);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Question Bank Management
  getQuestionsByCourse(courseId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${courseId}/questions`);
  }

  createQuestion(courseId: string, questionData: Omit<Question, 'id' | 'courseId'>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/${courseId}/questions`, questionData);
  }

  updateQuestion(courseId: string, questionId: string, questionData: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${courseId}/questions/${questionId}`, questionData);
  }

  deleteQuestion(courseId: string, questionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}/questions/${questionId}`);
  }

  bulkImportQuestions(courseId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${courseId}/questions/bulk-import`, formData);
  }

  // Exam Management
  getExamsByCourse(courseId: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/${courseId}/exams`);
  }

  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${environment.apiUrl}/exams`);
  }

  createExam(courseId: string, examData: Omit<Exam, 'id' | 'courseId' | 'courseName' | 'createdAt'>): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/${courseId}/exams`, examData);
  }

  updateExam(courseId: string, examId: string, examData: Partial<Exam>): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${courseId}/exams/${examId}`, examData);
  }

  deleteExam(courseId: string, examId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}/exams/${examId}`);
  }

  // Exam Paper Generation
  generateExamPaper(examId: string, blueprint: any): Observable<ExamPaper> {
    return this.http.post<ExamPaper>(`${environment.apiUrl}/exams/${examId}/papers`, { blueprint });
  }

  getExamPaper(examId: string, paperId: string): Observable<ExamPaper> {
    return this.http.get<ExamPaper>(`${environment.apiUrl}/exams/${examId}/papers/${paperId}`);
  }
}
