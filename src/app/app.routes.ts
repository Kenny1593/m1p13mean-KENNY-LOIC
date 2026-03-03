import { Routes } from '@angular/router';
import { Login } from './login/login';
import { User } from './user/user';
import { Categories } from './categories/categories';
import { Boutique } from './boutique/boutique';
import { Shop } from './shop/shop';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'user', component: User },
  { path: 'categories', component: Categories },
  { path: 'boutique', component: Boutique },
  { path: 'shop', component: Shop },
  { path: 'cart', component: CartComponent },
];
