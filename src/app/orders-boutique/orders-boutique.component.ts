import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navboutique } from '../navboutique/navboutique';

import { OrderBoutiqueService, Order, OrderFilters } from './order-boutique.service';

@Component({
  selector: 'app-orders-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navboutique],
  templateUrl: './orders-boutique.component.html',
  styleUrls: [],
})
export class OrdersBoutiqueComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalDocuments = 0;
  limit = 10;

  // Filtres
  filters: OrderFilters = { status: '', type: '', page: 1, limit: 10 };

  // Détail commande sélectionnée
  selectedOrder: Order | null = null;

  constructor(private orderService: OrderBoutiqueService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    const params: OrderFilters = {
      page: this.currentPage,
      limit: this.limit,
    };
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.type) params.type = this.filters.type;

    this.orderService.getOrdersByBoutique(params).subscribe({
      next: (response) => {
        this.orders = response.data.documents;
        this.totalDocuments = response.data.totalDocuments;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.page;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du chargement des commandes.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  resetFilters(): void {
    this.filters = { status: '', type: '' };
    this.currentPage = 1;
    this.loadOrders();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOrders();
  }

  selectOrder(order: Order): void {
    this.selectedOrder = this.selectedOrder?._id === order._id ? null : order;
  }

  getPages(): number[] {
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
