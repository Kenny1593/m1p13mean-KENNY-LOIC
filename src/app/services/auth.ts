import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; motDePasse: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.data.token);
          console.log('Token dans localStorage:', localStorage.getItem('token'));
        })
      );
  }

  register(data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
