import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Boutique } from '../boutique/boutique';

@Injectable({
  providedIn: 'root',
})
export class BoutiqueService {
  private apiUrl = 'http://localhost:3000/api/boutiques/';

  constructor(private http: HttpClient) {}

  register(data: { nom: string; description: string; image: string; email: string;categories: string[] ; actif: boolean }): Observable<any> {
        return this.http.post(`${this.apiUrl}with-relations`, data);
      }

  modif(data: any, id:string,options?: { headers: HttpHeaders }): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/with-relations`, data,options);
  }

  getBoutiqueById(id: string,options?: { headers: HttpHeaders }): Observable<Boutique> {
    return this.http.get<Boutique>(`${this.apiUrl}${id}`);
  }

  getBoutiques(options?: { headers: HttpHeaders }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}my`,options);
  }
}