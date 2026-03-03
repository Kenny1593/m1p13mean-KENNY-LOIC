import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../shop/services/shop.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';

  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  cart$ = this.cartSubject.asObservable();

  // Compteur total pour le badge header
  cartCount$ = new BehaviorSubject<number>(this.getTotalCount());

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private getTotalCount(): number {
    return this.loadFromStorage().reduce((sum, i) => sum + i.quantity, 0);
  }

  private emit(items: CartItem[]): void {
    this.saveToStorage(items);
    this.cartSubject.next(items);
    this.cartCount$.next(items.reduce((sum, i) => sum + i.quantity, 0));
  }

  getItems(): CartItem[] {
    return this.cartSubject.getValue();
  }

  addToCart(product: Product, quantity = 1): void {
    const items = [...this.getItems()];
    const existing = items.find((i) => i.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.emit(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const items = this.getItems().map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    this.emit(items);
  }

  removeItem(productId: string): void {
    this.emit(this.getItems().filter((i) => i.product.id !== productId));
  }

  clearCart(): void {
    this.emit([]);
  }

  getTotal(): number {
    return this.getItems().reduce((sum, i) => sum + i.product.prixFinal * i.quantity, 0);
  }

  getOriginalTotal(): number {
    return this.getItems().reduce((sum, i) => sum + i.product.prix * i.quantity, 0);
  }

  getTotalSavings(): number {
    return this.getOriginalTotal() - this.getTotal();
  }
}
