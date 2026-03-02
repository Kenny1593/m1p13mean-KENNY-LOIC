import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategorieService } from '../services/categories.service';  


@Component({
  selector: 'app-categories',
  imports: [RouterModule,Footer,Navbar,FormsModule,CommonModule],
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})

export class Categories {
  categorie = {
    nom: '',
    description: '',
    image: '',
    actif: true
  };

  constructor(private categorieService: CategorieService, private router: Router) {}

  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  imageBase64: string | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();

    // Preview
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.imageBase64= reader.result as string;
      //this.imageBase64 = (reader.result as string).split(',')[1]; // retirer "data:image/png;base64,"
    };

    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit() {
    const data = {
    nom: this.categorie.nom,
    description: this.categorie.description,
    image: this.imageBase64 ?? '', // Base64
    actif: this.categorie.actif
  };
    console.log(data);
    const token = localStorage.getItem('token'); // récupère le token après login

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.categorieService.register(data,  headers)
    .subscribe({
   
      next: (response) => {
        console.log("Succès :", response);
        alert('Catégorie ajoutée avec succès !');
        window.location.reload();
      },
      error: (error) => {
        alert('Erreur lors de l\'ajout de la catégorie.');
        console.error("Erreur :", error);
        window.location.reload();
      }
    });
  }
  

}
