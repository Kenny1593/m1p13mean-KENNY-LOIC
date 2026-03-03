import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProduitActif {
  _id: string;
  nom: string;
  prix: number;
  remise: number;
  enPromotion: boolean;
  pourcentagePromo: number;
  quantite: number;
  reference: string | null;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  itemDiscountPercentage: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  paymentMethod: string;
  globalDiscountPercentage: number;
  nomClient: string;
}

@Injectable({ providedIn: 'root' })
export class CreateOrderService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getProduitsActifs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produits/boutique/actifs`, {
      headers: this.getHeaders(),
    });
  }

  createOrder(payload: CreateOrderPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, payload, {
      headers: this.getHeaders(),
    });
  }
}
