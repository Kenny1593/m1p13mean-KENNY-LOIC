import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;

  constructor(private shopService: ShopService) {}

  get pages(): number[] {
    const pages = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.shopService.setPage(page);
  }

  getFirstPage(): number {
    return 1;
  }
  getLastPage(): number {
    return this.totalPages;
  }
  getNextPage(): number {
    return Math.min(this.page + 1, this.totalPages);
  }
  getPreviousPage(): number {
    return Math.max(1, this.page - 1);
  }
}
