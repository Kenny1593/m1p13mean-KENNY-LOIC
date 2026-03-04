import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navboutique } from '../navboutique/navboutique';
import { ProductBoutiqueService, Produit, Categorie } from '../create-product/create-product.service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navboutique],
  templateUrl: './list-product.component.html',
  styleUrls: [],
})
export class ListProductComponent implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalDocs = 0;
  limit = 10;

  // Filtres
  filters = {
    categorieId: '',
    actif: '',
    enPromotion: '',
  };

  constructor(private productService: ProductBoutiqueService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  // ============================================
  // CHARGEMENT CATÉGORIES (pour filtre select)
  // ============================================
  loadCategories(): void {
    this.productService.getMyBoutique().subscribe({
      next: (res) => {
        this.categories = res.data.boutique.categories || [];
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  // ============================================
  // CHARGEMENT PRODUITS
  // ============================================
  loadProducts(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      page: this.currentPage,
      limit: this.limit,
    };
    if (this.filters.categorieId) params.categorieId = this.filters.categorieId;
    if (this.filters.actif !== '') params.actif = this.filters.actif === 'true';
    if (this.filters.enPromotion !== '') params.enPromotion = this.filters.enPromotion === 'true';

    this.productService.getProducts(params).subscribe({
      next: (res) => {
        this.produits = res.data.documents;
        this.totalDocs = res.data.totalDocuments;
        this.totalPages = res.data.totalPages;
        this.currentPage = res.data.page;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur chargement produits.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.filters = { categorieId: '', actif: '', enPromotion: '' };
    this.currentPage = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  getPages(): number[] {
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // ============================================
  // HELPERS
  // ============================================
  getCategorieNom(produit: Produit): string {
    if (!produit.categorieId) return '—';
    if (typeof produit.categorieId === 'object') return produit.categorieId.nom;
    return '—';
  }

  getPrixFinal(produit: Produit): number {
    if (produit.enPromotion && produit.pourcentagePromo > 0) {
      return Math.round(produit.prix * (1 - produit.pourcentagePromo / 100) * 100) / 100;
    }
    if (produit.remise > 0) {
      return Math.round(produit.prix * (1 - produit.remise / 100) * 100) / 100;
    }
    return produit.prix;
  }
}

