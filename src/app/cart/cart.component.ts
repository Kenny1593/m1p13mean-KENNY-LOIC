import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from './cart.service';
import { CartApiService } from './cart-api.service';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: [],
})
export class CartComponent {
  cart$;
  isLoggedIn = false;
  userRole: string | null = null;

  // ✅ Champ adresse + états UI
  shippingAddress = '';
  isOrdering = false;
  orderSuccess: any = null;
  orderError: string | null = null;

  constructor(
    public cartService: CartService,
    private cartApiService: CartApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getRole();
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

  validateCart(): void {
    // 1. Vérif auth
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('redirectAfterLogin', '/cart');
      this.router.navigate(['/login']);
      return;
    }

    // 2. Vérif rôle
    if (this.authService.getRole() !== 'client') {
      this.orderError = 'Seuls les clients peuvent passer une commande.';
      return;
    }

    // 3. Vérif adresse
    if (!this.shippingAddress.trim()) {
      this.orderError = 'Veuillez saisir une adresse de livraison.';
      return;
    }

    // 4. Construire payload
    const cartItems = this.cartService.getItems().map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    if (cartItems.length === 0) {
      this.orderError = 'Votre panier est vide.';
      return;
    }

    // 5. Appel API
    this.isOrdering = true;
    this.orderError = null;
    this.orderSuccess = null;

    this.cartApiService.orderCart(cartItems, this.shippingAddress).subscribe({
      next: (response) => {
        console.log('✅ Réponse complète:', JSON.stringify(response, null, 2));
        this.isOrdering = false;
        this.orderSuccess = response.data; // { orders, count }
        this.cartService.clearCart(); // Vider le panier local
        this.shippingAddress = '';
      },
      error: (err) => {
        this.isOrdering = false;
        this.orderError = err.error?.message || 'Erreur lors de la commande. Veuillez réessayer.';
        console.error('❌ Erreur commande:', err);
      },
    });
  }
}
