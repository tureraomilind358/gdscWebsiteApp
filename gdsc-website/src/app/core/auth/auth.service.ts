import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  centreId?: string;
  centreName?: string;
  token?: string;
  refreshToken?: string;
  permissions?: string[];
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CENTRE_ADMIN = 'CENTRE_ADMIN',
  STUDENT = 'STUDENT'
}

export interface Centre {
  id: string;
  name: string;
  code: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  status: CentreStatus;
}

export enum CentreStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, userData);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserValue?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(this.currentUserValue?.role as UserRole);
  }

  isSuperAdmin(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }

  isCentreAdmin(): boolean {
    return this.hasRole(UserRole.CENTRE_ADMIN);
  }

  isStudent(): boolean {
    return this.hasRole(UserRole.STUDENT);
  }

  getCurrentCentreId(): string | null {
    return this.currentUserValue?.centreId || null;
  }

  canAccessCentre(centreId: string): boolean {
    if (this.isSuperAdmin()) return true;
    if (this.isCentreAdmin()) return this.getCurrentCentreId() === centreId;
    return false;
  }

  refreshToken(): Observable<User> {
    const refreshToken = this.currentUserValue?.refreshToken;
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }
    
    return this.http.post<User>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
