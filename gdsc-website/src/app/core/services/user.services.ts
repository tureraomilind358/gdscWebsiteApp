import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

export interface UserRegistrationRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isEnabled: boolean;
  password: string;
  isAccountNonExpired: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  roles: string[];
  centerId: number;
}

export interface UserRegistrationResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isEnabled: boolean;
  isAccountNonExpired: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  roles: string[];
  centerId: number;
}

@Injectable({
  providedIn: 'root'
})
export class  UserService
{
    constructor(private http: HttpClient){

    }

    getUserByUserName(username: string){
       return this.http.get(`${environment.apiUrl}/users/${username}`);
    }

    getUserByCenterId(centreId: string){
       return this.http.get(`${environment.apiUrl}/users/center/${centreId}`);
    }

    registerUser(userData: UserRegistrationRequest): Observable<UserRegistrationResponse> {
       return this.http.post<UserRegistrationResponse>(`${environment.apiUrl}/users/`, userData);
    }
}