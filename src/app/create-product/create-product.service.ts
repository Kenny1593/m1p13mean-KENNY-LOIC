import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categorie {
  _id: string;
  nom: string;
  description?: string;
}

export interface Boutique {
  _id: string;
  nom: string;
  categories: Categorie[];
}

export interface Produit {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  quantite: number;
  marque?: string;
  reference?: string;
  image?: string;
  categorieId: string | Categorie;
  boutiqueId?: string | Boutique;
  publierSurLeWeb: boolean;
  actif: boolean;
  enPromotion: boolean;
  pourcentagePromo: number;
  remise: number;
  prixFinal?: number;
  estDisponible?: boolean;
  createdAt?: string;
}

export interface ProduitFilters {
  page?: number;
  limit?: number;
  categorieId?: string;
  actif?: boolean;
  enPromotion?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductBoutiqueService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  // ✅ Récupère la boutique + ses catégories
  getMyBoutique(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boutiques/my`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Créer un produit
  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/produits`, data, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Liste backoffice paginée
  getProducts(filters: ProduitFilters = {}): Observable<any> {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.categorieId) params = params.set('categorieId', filters.categorieId);
    if (filters.actif !== undefined) params = params.set('actif', filters.actif.toString());
    if (filters.enPromotion !== undefined)
      params = params.set('enPromotion', filters.enPromotion.toString());

    return this.http.get(`${this.apiUrl}/produits`, {
      headers: this.getHeaders(),
      params,
    });
  }

  // ✅ Détail + modification
  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/produits/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Récupérer un produit par ID (via backoffice list filtré)
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/produits/${id}`, {
      headers: this.getHeaders(),
    });
  }
}

