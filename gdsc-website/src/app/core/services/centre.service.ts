import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Centre {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  status: CentreStatus;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  ownerName: string;
  ownerPhone: string;
}

export enum CentreStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export interface CreateCentreRequest {
  name: string;
  code: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  gstNumber?: string;
  panNumber?: string;
}

export interface KYCDocument {
  id: string;
  centreId: string;
  type: 'GST' | 'PAN' | 'ADDRESS_PROOF' | 'OWNER_ID';
  fileName: string;
  fileUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CentreService {
  private apiUrl = `${environment.apiUrl}/centres`;

  constructor(private http: HttpClient) {}

  // Public centre registration
  registerCentre(centreData: CreateCentreRequest): Observable<Centre> {
    return this.http.post<Centre>(`${this.apiUrl}/register`, centreData);
  }

  // Admin: Get all centres with filtering
  getAllCentres(status?: CentreStatus): Observable<Centre[]> {
    const params: any = {};
    if (status) {
      params.status = status;
    }
    return this.http.get<Centre[]>(this.apiUrl, { params });
  }

  // Get centre by ID
  getCentreById(id: string): Observable<Centre> {
    return this.http.get<Centre>(`${this.apiUrl}/${id}`);
  }

  // Admin: Approve/Reject centre
  updateCentreStatus(id: string, status: CentreStatus, remarks?: string): Observable<Centre> {
    return this.http.patch<Centre>(`${this.apiUrl}/${id}/status`, { status, remarks });
  }

  // Admin: Update centre details
  updateCentre(id: string, centreData: Partial<Centre>): Observable<Centre> {
    return this.http.put<Centre>(`${this.apiUrl}/${id}`, centreData);
  }

  // Admin: Delete centre
  deleteCentre(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // KYC Document management
  uploadKYCDocument(centreId: string, type: string, file: File): Observable<KYCDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<KYCDocument>(`${this.apiUrl}/${centreId}/kyc`, formData);
  }

  getKYCDocuments(centreId: string): Observable<KYCDocument[]> {
    return this.http.get<KYCDocument[]>(`${this.apiUrl}/${centreId}/kyc`);
  }

  approveKYCDocument(centreId: string, documentId: string): Observable<KYCDocument> {
    return this.http.patch<KYCDocument>(`${this.apiUrl}/${centreId}/kyc/${documentId}`, { status: 'APPROVED' });
  }

  rejectKYCDocument(centreId: string, documentId: string, remarks: string): Observable<KYCDocument> {
    return this.http.patch<KYCDocument>(`${this.apiUrl}/${centreId}/kyc/${documentId}`, { 
      status: 'REJECTED', 
      remarks 
    });
  }
}
