import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  motDePasse: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {

    const data = {
      email: this.email,
      motDePasse : this.motDePasse
    };

    this.authService.login(data).subscribe({
      next: (response) => {
        console.log("Succès :", response);
        alert('Connexion réussie !');
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error("Erreur :", error);
      }
    });
}
}