import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { Navboutique } from '../navboutique/navboutique';

@Component({
  selector: 'app-produits',
  imports: [RouterModule,Footer,CommonModule,Navboutique],
  templateUrl: './produits.html',
  styleUrl: './produits.css',
})
export class Produits {

}
