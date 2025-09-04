import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

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
}