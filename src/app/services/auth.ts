import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; motDePasse: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data: { _id: number; nom: string; email: string; motDePasse: string; role: string; boutiqueId: number; telephone: string; adresse: string; actif: boolean }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
