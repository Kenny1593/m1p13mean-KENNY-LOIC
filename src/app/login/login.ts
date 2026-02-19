import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth'; 

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  motDePasse: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.motDePasse);

    const data = {
      email: this.email,
      motDePasse : this.motDePasse
    };

    this.authService.login(data).subscribe({
      next: (response) => {
        console.log("Succès :", response);
      },
      error: (error) => {
        console.error("Erreur :", error);
      }
    });
}
}