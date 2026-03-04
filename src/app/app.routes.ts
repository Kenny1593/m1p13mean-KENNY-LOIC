import { Routes } from '@angular/router';
import { Login } from './login/login';
import { User } from './user/user';
import { Categories } from './categories/categories';
import { Boutique } from './boutique/boutique';
import { Userboutique } from './userboutique/userboutique';
import { Produits } from './produits/produits';
import { Modifboutique } from './modifboutique/modifboutique';
import { Shop } from './shop/shop';
import { CartComponent } from './cart/cart.component';
import { OrdersBoutiqueComponent } from './orders-boutique/orders-boutique.component';

import { CreateOrderComponent } from './create-order/create-order.component';


import { CreateProductComponent } from './create-product/create-product.component';
import { ListProductComponent } from './list-product/list-product.component';


import { DetailProductComponent } from './detail-product/detail-product.component';




export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'user', component: User },
  { path: 'categories', component: Categories },
  { path: 'boutique', component: Boutique },
  { path: 'userboutique', component: Userboutique },
  { path: 'produit', component: Produits },
  { path: 'modifboutique', component: Modifboutique },
  { path: 'shop', component: Shop },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersBoutiqueComponent },
  { path: 'orders/create', component: CreateOrderComponent },
  { path: 'products/create', component: CreateProductComponent },
  { path: 'products', component: ListProductComponent },
  { path: 'products/:id', component: DetailProductComponent },
];
