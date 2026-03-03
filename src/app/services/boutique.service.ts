import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Boutique } from '../boutique/boutique';

@Injectable({
  providedIn: 'root',
})
export class BoutiqueService {
  private apiUrl = 'http://localhost:3000/api/boutiqueS/';

  constructor(private http: HttpClient) {}

  register(data: { nom: string; description: string; image: string; email: string;categories: string[] ; actif: boolean }): Observable<any> {
        return this.http.post(`${this.apiUrl}`, data);
      }
  
}
