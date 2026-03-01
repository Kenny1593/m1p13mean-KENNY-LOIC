import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private apiUrl = 'http://localhost:3000/api/categories/';

  constructor(private http: HttpClient) {}

  register(data: { nom: string; description: string; image: string; actif: boolean }, options?: any): Observable<any> {
      return this.http.post(`${this.apiUrl}`, data,options);
    }
    
}
