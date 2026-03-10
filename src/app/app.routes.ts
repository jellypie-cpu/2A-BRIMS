import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { DashboardLayout } from './components/layout/main-dashboard/main-dashboard';
import { DashboardHome } from './components/pages/dashboard-home/dashboard-home';
import { ResidentsInformation } from './components/pages/residents-information/residents-information';
import { BarangayCertificates } from './components/pages/barangay-certificates/barangay-certificates';
import { BaranggayPermit } from './components/pages/baranggay-permit/baranggay-permit';
import { CertificateOfIndigency } from './components/pages/certificate-of-indigency/certificate-of-indigency';
import { BlotterRecords } from './components/pages/blotter-records/blotter-records';
import { SystemSettings } from './components/pages/system-settings/system-settings';
import { Users } from './components/pages/users/users';

export const routes: Routes = [
  { path: 'login', component: Login },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome },
      { path: 'residents-information', component: ResidentsInformation },
      { path: 'barangay-certificates', component: BarangayCertificates },
      { path: 'barangay-permit', component: BaranggayPermit },
      { path: 'certificate-of-indigency', component: CertificateOfIndigency },
      { path: 'blotter-records', component: BlotterRecords },
      { path: 'system-settings', component: SystemSettings },
      { path: 'users', component: Users }
    ]
  }
];