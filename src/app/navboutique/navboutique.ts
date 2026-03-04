import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './navboutique.html',
  styleUrl: './navboutique.css',
})
export class Navboutique {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('boutiqueId');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

}
