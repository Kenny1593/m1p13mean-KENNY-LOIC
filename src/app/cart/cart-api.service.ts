import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItemPayload {
  productId: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private apiUrl = 'https://m1p13mean-loic-kenny.onrender.com/api/cart';

  constructor(private http: HttpClient) {}

  orderCart(cartItems: CartItemPayload[], shippingAddress: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/order`, { cartItems, shippingAddress }, { headers });
  }
}
