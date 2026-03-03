import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  itemDiscountPercentage: number;
  itemDiscountAmount: number;
  itemSubtotal: number;
}

export interface Order {
  _id: string;
  reference: string;
  type: 'in_store' | 'online';
  status: 'draft' | 'pending' | 'paid' | 'completed' | 'cancelled';
  nomClient: string;
  clientId?: { _id: string; nom: string; email: string };
  sellerId?: { _id: string; nom: string; email: string };
  boutiqueId: { _id: string; nom: string };
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderDate: string;
}

export interface OrdersResponse {
  documents: Order[];
  totalDocuments: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface OrderFilters {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class OrderBoutiqueService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getOrdersByBoutique(filters: OrderFilters = {}): Observable<any> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get(`${this.apiUrl}/boutique`, {
      headers: this.getHeaders(),
      params,
    });
  }
}

