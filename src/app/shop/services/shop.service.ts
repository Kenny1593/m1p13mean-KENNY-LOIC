import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
//import { environment } from '../../../../environments/environment';

// ============================================
// INTERFACES TYPESCRIPT COMPLÈTES
// ============================================

export interface Category {
  id: string;
  nom: string;
  description: string;
  produitCount: number;
}

export interface Product {
  id: string;
  nom: string;
  description: string;
  prix: number;
  quantite: number;
  image: string;
  boutiqueNom: string;
  categorieNom: string;
  enPromotion: boolean;
  pourcentagePromo: number;
  remise: number;
  prixFinal: number;
}

export interface ProductPage {
  products: Product[];
  totalDocuments: number;
  totalPages: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  //private apiUrl = `${environment.apiUrl}`;
  private apiUrl = `https://m1p13mean-loic-kenny.onrender.com/api`;

  // État partagé avec délai minimal pour éviter émissions immédiates
  private selectedCategorySubject = new BehaviorSubject<string>('all');
  selectedCategory$ = this.selectedCategorySubject.asObservable().pipe(
    switchMap((categoryId) => timer(0).pipe(map(() => categoryId))) // ✅ Délai minimal
  );

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable().pipe(
    switchMap((page) => timer(0).pipe(map(() => page))) // ✅ Délai minimal
  );

  constructor(private http: HttpClient) {}

  // ============================================
  // MÉTHODE 1 : CATÉGORIES AVEC COMPTAGE
  // ============================================
  getCategoriesWithCount(): Observable<Category[]> {
    return this.http.get<any>(`${this.apiUrl}/categories/public/with-count`).pipe(
      map((response) => {
        if (response.success && response.data?.categories) {
          return response.data.categories.map((cat: any) => ({
            id: cat._id,
            nom: cat.nom,
            description: cat.description,
            produitCount: cat.produitCount || 0,
          }));
        }
        return [
          {
            id: 'all',
            nom: 'Tous les produits',
            description: 'Tous nos produits',
            produitCount: 0,
          },
        ];
      })
    );
  }

  // ============================================
  // MÉTHODE 2 : PRODUITS AVEC PAGINATION + FILTRE
  // ============================================
  getProducts(page: number = 1, limit: number = 12, categoryId?: string): Observable<ProductPage> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (categoryId && categoryId !== 'all') {
      params = params.set('categorieId', categoryId);
    }

    return this.http.get<any>(`${this.apiUrl}/produits/public`, { params }).pipe(
      map((response) => {
        if (response.success && response.data) {
          const products = response.data.documents.map((doc: any) => {
            const basePrice = doc.prix || 0;
            const discount = doc.pourcentagePromo || doc.remise || 0;
            const calculatedPrice = basePrice - (basePrice * discount) / 100;
            const finalPrice = doc.prixFinal || calculatedPrice || basePrice;

            return {
              id: doc._id,
              nom: doc.nom,
              description: doc.description,
              prix: basePrice,
              quantite: doc.quantite || 0,
              image: doc.image || "https://via.placeholder.com/200x150?text=Pas+d'image",
              boutiqueNom: doc.boutiqueId?.nom || 'Boutique inconnue',
              categorieNom: doc.categorieId?.nom || 'Catégorie inconnue',
              enPromotion: doc.enPromotion || false,
              pourcentagePromo: doc.pourcentagePromo || 0,
              remise: doc.remise || 0,
              prixFinal: Math.round(finalPrice * 100) / 100,
            };
          });

          return {
            products,
            totalDocuments: response.data.totalDocuments || 0,
            totalPages: response.data.totalPages || 1,
            page: response.data.page || 1,
            limit: response.data.limit || 12,
          };
        }
        return {
          products: [],
          totalDocuments: 0,
          totalPages: 1,
          page: 1,
          limit: 12,
        };
      })
    );
  }

  // ============================================
  // MÉTHODES DE MISE À JOUR SÉCURISÉES
  // ============================================
  selectCategory(categoryId: string): void {
    this.selectedCategorySubject.next(categoryId);
    this.currentPageSubject.next(1); // Réinitialiser page
  }

  setPage(page: number): void {
    this.currentPageSubject.next(page);
  }

  getSelectedCategory(): string {
    return this.selectedCategorySubject.getValue();
  }

  getCurrentPage(): number {
    return this.currentPageSubject.getValue();
  }

  // Ajoute dans ShopService
  orderCart(
    cartItems: { productId: string; quantity: number }[],
    shippingAddress: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      `http://localhost:3000/api/cart/order`,
      { cartItems, shippingAddress },
      { headers }
    );
  }
}
