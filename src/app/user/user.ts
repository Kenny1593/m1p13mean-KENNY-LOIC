import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user',
  imports: [FormsModule, RouterModule, Footer, CommonModule],
  standalone: true,
  templateUrl: './user.html',
  styleUrls: ['./user.css'], // ⚡ attention: pluriel
})
export class User {
  nom: string = '';
  email: string = '';
  motDePasse: string = '';
  confirmMotDePasse: string = '';
  role: string = 'client';
  boutiqueId: number = 0;
  telephone: string = '';
  actif: boolean = true;

  // 🔹 Adresse initialisée pour éviter undefined
  adresse = {
    rue: '',
    ville: '',
    codePostal: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {

    const data = {
      nom: this.nom,
      email: this.email,
      motDePasse: this.motDePasse, 
      role: this.role,
      telephone: this.telephone,
      adresse: this.adresse,
      actif: this.actif
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        alert('Utilisateur enregistré avec succès !');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Erreur :", error);
        alert('Erreur lors de l\'enregistrement : ' + error.error?.message || error.message);
      }
    });
  }
}