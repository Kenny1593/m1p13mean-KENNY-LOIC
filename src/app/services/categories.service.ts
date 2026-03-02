import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Categories } from '../categories/categories';
import { map } from 'rxjs/operators';

interface CategorieResponse {
  success: boolean;
  result: {
    page: number;
    limit: number;
    totalDocuments: number;
    totalPages: number;
    filtre: any;
    documents: Categories[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private apiUrl = 'http://localhost:3000/api/categories/';

  constructor(private http: HttpClient) {}

  register(data: { nom: string; description: string; image: string; actif: boolean }, options?: any): Observable<any> {
      return this.http.post(`${this.apiUrl}`, data,options);
    }

  find(options?: { headers: HttpHeaders }): Observable<Categories[]> {
     return this.http.get<CategorieResponse>(`${this.apiUrl}list`, options).pipe(
        map(res =>res.result.documents)// Assure que res.documents est un tableau 
      );
  }
    
}
