import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { HeaderComponent } from '../header/header.component';
import { ShopService } from './services/shop.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListComponent,
    ProductGridComponent,
    PaginationComponent,
    HeaderComponent,
  ],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop implements OnInit {
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    // Synchroniser l'état pour l'affichage
    this.shopService.currentPage$.subscribe((page) => (this.currentPage = page));

    // Écouter les changements de produits pour mettre à jour les totaux
    // (Optionnel - peut être géré directement dans ProductGridComponent)
  }
}
