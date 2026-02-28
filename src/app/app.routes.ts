import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { DashboardLayout } from './components/layout/main-dashboard/main-dashboard';
import { DashboardHome } from './components/pages/dashboard-home/dashboard-home';
import { ResidentsInfor } from './components/pages/residents-infor/residents-infor';

export const routes: Routes = [
  { path: 'login', component: Login },
  

  {
    path: 'dashboard',
    component: DashboardLayout,   // layout ONLY
    children: [ 
      { path: '', component: DashboardHome }, 
      { path: 'residents-infor', component: ResidentsInfor },
    ],
  },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
