import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { DashboardLayout } from './components/layout/main-dashboard/main-dashboard';
import { DashboardHome } from './components/pages/dashboard-home/dashboard-home';
import { ResidentsInformation } from './components/pages/residents-information/residents-information';

export const routes: Routes = [
  { path: 'login', component: Login },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardLayout, children: [
        { path: '', component: DashboardHome },
      ]},
  

  
      { path: 'residents-information', component: ResidentsInformation },
    
  
    ]
