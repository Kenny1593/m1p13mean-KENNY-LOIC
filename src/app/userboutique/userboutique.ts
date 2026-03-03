import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userboutique',
  imports: [FormsModule, RouterModule, Footer, Navbar, CommonModule],
  templateUrl: './userboutique.html',
  styleUrl: './userboutique.css',
})


export class Userboutique {

  constructor(private authService: AuthService, private router: Router) {}

  nom: string = '';
  email: string = '';
  motDePasse: string = '000000';
  role: string = 'boutique_en_attente';
  boutiqueId: number = 0;
  telephone: string = '';
  actif: boolean = true;

  onsubmit() {
    const data = {
      nom: this.nom,
      email: this.email,
      motDePasse: this.motDePasse, 
      role: this.role,
      telephone: this.telephone,
      actif: this.actif
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        alert('Utilisateur enregistré avec succès !');
      },
      error: (error) => {
        alert('Erreur lors de l\'enregistrement de l\'utilisateur.');
      }
    });
  }
}
