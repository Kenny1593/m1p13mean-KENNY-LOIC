import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth'; 
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule,Footer,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = 'voni@gmail.com';
  motDePasse: string = 'voni123';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {

    const data = {
      email: this.email,
      motDePasse : this.motDePasse
    };
    alert('Connexion réussie !');
    
    this.authService.login(data).subscribe({
      next: (response) => {
      const users = response?.data?.users;
      const role = response.data.user.role;
      console.log("Role :", role);

      if (role === 'admin') {
        this.router.navigate(['/categories']);
      } else if (role === 'client') {
        this.router.navigate(['/user']);
      } else if (role === 'boutique') {
        this.router.navigate(['/userboutique']);
      }

    
  },
      error: (error) => {
        alert(error.message || 'Erreur de connexion' );
        console.error("Erreur :", error);
      }
    
    });
}
}