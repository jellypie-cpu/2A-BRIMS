import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Home } from './components/home/home';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home },


  // default route
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
