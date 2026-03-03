import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategorieService } from '../services/categories.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BoutiqueService } from '../services/boutique.service';
import { Footer } from '../footer/footer';
import { Navboutique } from '../navboutique/navboutique';
import { RouterModule } from '@angular/router';
import { ApiResponse, UsersService } from '../services/users.service';

interface Categories {
  _id: string;
  nom: string;
}


@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,Footer,Navboutique,RouterModule],
  templateUrl: './modifboutique.html',
  styleUrl: './modifboutique.css',
})
export class Modifboutique {

  form: FormGroup;
    categories: Categories[] = [];
  
    constructor(private fb: FormBuilder,private categorieService: CategorieService,private boutiqueService: BoutiqueService,private userService: UsersService ) {
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
        const boutiqueId = localStorage.getItem('boutiqueId'); // Récupérer l'ID de la boutique depuis le localStorage

        const headers = 
        new HttpHeaders(
        {
          Authorization: `Bearer ${token}`
        });

      this.boutiqueService.getBoutiqueById(boutiqueId!,{ headers }).subscribe({
    next: (res: any) => {
      console.log("Données de la boutique :", res);

      // Remplir le formulaire avec les valeurs existantes
      this.form.patchValue({
        nom: res.data.nom,
        description: res.data.description,
        telephone: res.data.telephone,
        email: res.data.email,
        actif: res.data.actif,
        categories: res.data.categories?.map((c: any) => c._id) || []
      });
    },
    error: (err) => console.error("Erreur récupération boutique", err)
  });  

        // Récupération des catégories pour le select multiple
        this.categorieService.find({ headers }).subscribe({
        next: (res: any) => {3
          this.categories = Array.isArray(res) ? res : res.result.documents;
        },
        error: (err) => console.error('Erreur récupération catégories', err)
      });
    }


    onSubmit() {

    const data = {
      nom: this.form.value.nom,
      description: this.form.value.description,
      telephone: this.form.value.telephone,
      email: this.form.value.email,
      actif: this.form.value.actif,
      users: this.form.value.users,
      categories: this.form.value.categories, // tableau des catégories sélectionnées
  };
  const boutiqueId = localStorage.getItem('boutiqueId'); // Récupérer l'ID de la boutique depuis le localStorage

  this.boutiqueService.modif(data,boutiqueId!,{ headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }) })
    .subscribe({
      next: (response) => {
        console.log("Succès :", response);
        alert('Boutique modifiée avec succès !');
        window.location.reload();
      },
      error: (error) => {
        alert('Erreur lors de la modification de la boutique.');
        console.error("Erreur :", error);
        window.location.reload();

  }
    });

  }
  

}
