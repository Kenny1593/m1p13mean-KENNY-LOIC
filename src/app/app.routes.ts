import { Routes } from '@angular/router';
import { Login } from './login/login';
import { User } from './user/user';
import { Categories } from './categories/categories';
import { Boutique } from './boutique/boutique';
import { Userboutique } from './userboutique/userboutique';
import { Produits } from './produits/produits';
import { Modifboutique } from './modifboutique/modifboutique';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'user', component: User },
    { path: 'categories', component: Categories },
    { path: 'boutique', component: Boutique },
    {path: 'userboutique',component: Userboutique},
    {path: 'produit',component: Produits},
    {path:'modifboutique',component: Modifboutique}
];
