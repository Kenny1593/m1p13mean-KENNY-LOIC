import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Product, ProductPage } from '../../services/shop.service';
import { combineLatest } from 'rxjs'; // ✅ COMBINE LES OBSERVABLES
import { CartService } from '../../../cart/cart.service';


@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css'],
})
export class ProductGridComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;

  // Drapeau pour éviter les appels concurrents
  private isProcessing = false;

  constructor(
    private shopService: ShopService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // ✅ COMBINE LES DEUX OBSERVABLES EN UN SEUL
    // Évite les appels doubles à loadProducts()
    combineLatest([this.shopService.selectedCategory$, this.shopService.currentPage$]).subscribe(
      ([categoryId, page]) => {
        // ✅ ÉVITE LES APPELS CONCURRENTS
        if (this.isProcessing) return;

        this.currentPage = page;
        this.loadProducts();
      }
    );
  }

  loadProducts(): void {
    // ✅ VERROUILLAGE POUR ÉVITER LES APPELS MULTIPLES
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.loading = true;
    this.error = null;

    const categoryId = this.shopService.getSelectedCategory();
    const page = this.shopService.getCurrentPage();

    this.shopService.getProducts(page, 12, categoryId).subscribe({
      next: (data: ProductPage) => {
        this.products = data.products;
        this.totalPages = data.totalPages;
        this.totalProducts = data.totalDocuments;

        // ✅ MISE À JOUR SÉCURISÉE AVEC DÉLAI MINIMAL
        setTimeout(() => {
          this.loading = false;
          this.isProcessing = false;
          this.cdr.detectChanges(); // Force la détection après modification
        }, 0);
      },
      error: (err) => {
        console.error('❌ Erreur chargement produits:', err);
        this.error = 'Impossible de charger les produits. Veuillez réessayer.';

        setTimeout(() => {
          this.loading = false;
          this.isProcessing = false;
          this.cdr.detectChanges();
        }, 0);
      },
    });
  }

  addToCart(product: Product): void {
    console.log('🛒 Ajout au panier :', product.nom);
    this.cartService.addToCart(product);
    alert(`Produit ajouté : ${product.nom}`);
  }

  calculateDiscountPercentage(product: Product): number {
    if (product.enPromotion && product.pourcentagePromo > 0) {
      return product.pourcentagePromo;
    }
    return product.remise || 0;
  }

  isProductOnSale(product: Product): boolean {
    return (product.enPromotion && product.pourcentagePromo > 0) || product.remise > 0;
  }
}

