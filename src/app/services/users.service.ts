import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {  User } from '../user/user';
import { map } from 'rxjs/operators';

export interface UsersBoutique {
  _id: string;
  nom: string;
  email: string;
  telephone: string;
  role: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    totalUsers: number;
    users: UsersBoutique[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
    private apiUrl = 'http://localhost:3000/api/users/';

      constructor(private http: HttpClient) {}


    find(options?: { headers: HttpHeaders }): Observable<ApiResponse> {
      return this.http.get<ApiResponse>(`${this.apiUrl}enattente`, options);
    }
}
