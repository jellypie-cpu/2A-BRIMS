import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { DashboardComponent } from './components/layout/dashboard/dashboard';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: DashboardComponent },


  // default route
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
