import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategorieService } from '../services/categories.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BoutiqueService } from '../services/boutique.service';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { RouterModule } from '@angular/router';

interface Categories {
  _id: string;
  nom: string;
}

@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,Footer,Navbar,RouterModule],
  templateUrl: './boutique.html',
  styleUrl: './boutique.css',
})
export class Boutique implements OnInit {

  //Base 64
  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  imageBase64: string | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
      this.imageBase64= reader.result as string;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  // Formulaire multiple
  form: FormGroup;
  categories: Categories[] = [];

  constructor(private fb: FormBuilder,private categorieService: CategorieService,private boutiqueService: BoutiqueService) {
    this.form = this.fb.group({
      nom: [''],
      description: [''],
      image: [''],
      telephone: [''],
      email: [''],
      actif: [true],
      userboutique: new FormControl([]), // champ select multiple
      categories: new FormControl([]) // champ select multiple
    });
  }

  // Récupération des catégories pour le select multiple
  ngOnInit() {
    const token = localStorage.getItem('token'); // récupère le token après login

    const headers = 
    new HttpHeaders(
    {
      Authorization: `Bearer ${token}`
    });

    this.categorieService.find({ headers }).subscribe({
    next: (res: any) => {3
      this.categories = Array.isArray(res) ? res : res.result.documents;
    },
    error: (err) => console.error('Erreur récupération catégories', err)
  });
}


//ajout d'une boutique
  onSubmit() {

    const data = {
      nom: this.form.value.nom,
      description: this.form.value.description,
      image: this.imageBase64 ?? '', // Base64
      telephone: this.form.value.telephone,
      email: this.form.value.email,
      actif: this.form.value.actif,
      categories: this.form.value.categories // tableau des catégories sélectionnées
  };
  this.boutiqueService.register(data)
    .subscribe({
      next: (response) => {
        console.log("Succès :", response);
        alert('Boutique ajoutée avec succès !');
        window.location.reload();
      },
      error: (error) => {
        alert('Erreur lors de l\'ajout de la boutique.');
        console.error("Erreur :", error);
        window.location.reload();

  }
    });

  }
}
