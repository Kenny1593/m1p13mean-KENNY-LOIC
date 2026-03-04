import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {
  private apiUrl = 'http://localhost:3000/api/produits/';

  constructor(private http: HttpClient) {}

  createProduit(data: any,options?: { headers: HttpHeaders }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data, options);
  }

}
