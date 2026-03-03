import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Category } from '../../services/shop.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: string = 'all';
  loading = false;

  constructor(
    private shopService: ShopService,
    private cdr: ChangeDetectorRef // ✅ Injecte ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.shopService.selectedCategory$.subscribe((categoryId) => {
      this.selectedCategory = categoryId;
      this.cdr.markForCheck(); // ✅ Notifie Angular proprement
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.shopService.getCategoriesWithCount().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
        this.cdr.markForCheck(); // ✅ Idem ici
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectCategory(categoryId: string): void {
    this.shopService.selectCategory(categoryId);
  }

  getProductsCountText(count: number): string {
    return count === 1 ? `${count} produit` : `${count} produits`;
  }
}
