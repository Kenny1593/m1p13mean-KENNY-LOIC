import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from './cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: [],
})

export class CartComponent {
  cart$;

  constructor(public cartService: CartService) {
    this.cart$ = this.cartService.cart$;
  }

  updateQty(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + delta);
  }
  remove(productId: string): void {
    this.cartService.removeItem(productId);
  }
  clear(): void {
    if (confirm('Vider le panier ?')) this.cartService.clearCart();
  }
}
