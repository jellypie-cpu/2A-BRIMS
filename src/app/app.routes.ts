import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Dashboard} from './components/layout/main-dashboard/main-dashboard';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  

  // default route
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
