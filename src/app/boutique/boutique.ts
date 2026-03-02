import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategorieService } from '../services/categories.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Categorie {
  _id: string;
  nom: string;
}

@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
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
  categories: Categorie[] = [];

  constructor(private fb: FormBuilder,private categorieService: CategorieService) {
    this.form = this.fb.group({
      nom: [''],
      description: [''],
      image: [''],
      telephone: [''],
      email: [''],
      actif: [true],
      categories: new FormControl([]) // champ select multiple
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token'); // récupère le token après login

    const headers = 
    new HttpHeaders(
    {
      Authorization: `Bearer ${token}`
    });

    this.categorieService.find({ headers }).subscribe({
    next: (res: any) => {
      this.categories = Array.isArray(res) ? res : res.result.documents;
    },
    error: (err) => console.error('Erreur récupération catégories', err)
  });
}

  onSubmit() {
    console.log("Boutique créée :", this.form.value);

  }


}
