import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  onSubmit() {
    console.log(this.categorie);
  }
  

}
