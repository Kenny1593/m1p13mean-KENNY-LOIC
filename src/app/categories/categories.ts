import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [RouterModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
