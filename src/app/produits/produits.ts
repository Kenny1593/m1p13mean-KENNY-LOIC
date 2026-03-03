import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { Navboutique } from '../navboutique/navboutique';
import { FormBuilder, FormGroup, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import { CategorieService } from '../services/categories.service';
import { ProduitsService } from '../services/produits.service';
import { HttpHeaders } from '@angular/common/http';
import { BoutiqueService } from '../services/boutique.service';

interface Categories {
  _id: string;
  nom: string;
}

@Component({
  selector: 'app-produits',
  imports: [RouterModule,Footer,CommonModule,Navboutique,ReactiveFormsModule],
  templateUrl: './produits.html',
  styleUrl: './produits.css',
})
export class Produits implements OnInit{
  produitForm!: FormGroup;
  categories: Categories[] = [];

  // Gestion de l'image
  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  imageBase64: string | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private produitsService: ProduitsService,
    private boutiqueService: BoutiqueService
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
      this.imageBase64= reader.result as string;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  ngOnInit(){
    // Simuler la récupération des catégories depuis une API
    this.produitForm = this.fb.group({
      nom: [''],
      description: [''],
      marque: [''],
      reference: [''],
      prix: [0],
      image: [''],
      quantite: [0],
      boutiqueId: [''],
      actif: [true],
      enPromo: [false],
      pourcentagePromo: [0],
      remise: [0],
      publierSurLeWeb: [false],
      categories: new FormControl([]) // champ select multiple
    });

    const token = localStorage.getItem('token'); // récupère le token après login

    const headers = 
    new HttpHeaders(
    {
      Authorization: `Bearer ${token}`
    });

    this.boutiqueService.getBoutiques({ headers }).subscribe({
      next: (res: any) => {
       this.categories = res.data.boutique.categories || [];
      },
      error: (error) => {
        alert('Erreur lors de la sélection des catégories.');
        console.error("Erreur :", error);
      }
    });
  }

  onSubmit() {
    const token = localStorage.getItem('token'); // récupère le token après login
    const boutiqueId = localStorage.getItem('boutiqueId'); // Récupérer l'ID de la boutique depuis le localStorage

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


    const data = {
      nom: this.produitForm.value.nom,
      description: this.produitForm.value.description, 
      marque: this.produitForm.value.marque,
      reference: this.produitForm.value.reference,
      prix: this.produitForm.value.prix,
      image: this.imageBase64 ?? '', // Base64
      quantite: this.produitForm.value.quantite,
      boutiqueId: boutiqueId,
      categories: this.produitForm.value.categories,
      actif: this.produitForm.value.actif,
      enPromo: this.produitForm.value.enPromo,
      pourcentagePromo: this.produitForm.value.pourcentagePromo,
      remise: this.produitForm.value.remise,
      publierSurLeWeb: this.produitForm.value.publierSurLeWeb,
    };

    console.log("Données à envoyer :", data);

    this.produitsService.createProduit(data, { headers }).subscribe({
      next: (response) => {
        console.log("Succès :", response);
        alert('Produit créé avec succès !');
        // this.produitForm.reset();
      },
      error: (error) => {
        alert('Erreur lors de la création du produit.');
        console.error("Erreur :", error);
      }
    });
  }

}
