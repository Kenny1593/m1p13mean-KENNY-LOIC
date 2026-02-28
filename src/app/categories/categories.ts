import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-categories',
  imports: [RouterModule,Footer,Navbar],
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {

  

}
