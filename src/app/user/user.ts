import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  imports: [FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
    _id: number = 0;
    nom: string = '';
    email: string = '';
    motDePasse: string = '';
    role: string = '';
    boutiqueId: number = 0;
    telephone: string = '';
    adresse: string = '';
    actif: boolean = true;
  
    constructor(private authService: AuthService, private router: Router) {}

    

  
    onSubmit() {
      const data = {
        _id: this._id,
        nom: this.nom,
        email: this.email,
        motDePasse : this.motDePasse,
        role: this.role,
        boutiqueId: this.boutiqueId,
        telephone: this.telephone,
        adresse: this.adresse,
        actif: this.actif
      };
      
      this.authService.register(data).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
          console.log("Succès :", response);
          alert('Utilisateur enregistré avec succès !');
        },
        error: (error) => {
          console.error("Erreur :", error);
          alert('Erreur lors de l\'enregistrement de l\'utilisateur : ' + error.error.message);
        }
      });
  }
}
