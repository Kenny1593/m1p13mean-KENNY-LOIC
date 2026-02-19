import { Routes } from '@angular/router';
import { Login } from './login/login';
import { User } from './user/user';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'user', component: User }
];
