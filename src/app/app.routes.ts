import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { About } from './components/login/about/about';
import { Contacts } from './components/login/contacts/contacts';
import { DashboardLayout } from './components/layout/main-dashboard/main-dashboard';
import { DashboardHome } from './components/pages/dashboard-home/dashboard-home';
import { ResidentsInformation } from './components/pages/residents-information/residents-information';
import { BarangayCertificates } from './components/pages/barangay-certificates/barangay-certificates';
import { BaranggayClearance } from './components/pages/barangay-certificates/baranggay-clearance/baranggay-clearance';
import { BaranggayIndigency } from './components/pages/barangay-certificates/baranggay-indigency/baranggay-indigency';
import { BaranggayPermit } from './components/pages/barangay-certificates/baranggay-permit/baranggay-permit';
import { CertificatesRequest } from './components/pages/certificates-request/certificates-request';
import { BlotterRecords } from './components/pages/blotter-records/blotter-records';
import { SystemSettings } from './components/pages/system-settings/system-settings';
import { Users } from './components/pages/users/users';
import { Profile } from './components/pages/profile/profile';
import { ProfileOverview } from './components/pages/profile/overview/overview';
import { ProfileMyInformation } from './components/pages/profile/my-information/my-information';
import { ProfileHelp } from './components/pages/profile/help/help';
import { ProfileAccountSettings } from './components/pages/profile/account-settings/account-settings';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'about', component: About },
  { path: 'Contacts', component: Contacts },


  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome },
      { path: 'residents-information', component: ResidentsInformation },
      {path: 'certificates-request', component: CertificatesRequest },
      { path: 'blotter-records', component: BlotterRecords },
      { path: 'system-settings', component: SystemSettings },
      { path: 'users', component: Users },

      { path: 'barangay-certificates', component: BarangayCertificates,
        children: [
          {path: '', redirectTo: 'BaranggayClearance', pathMatch: 'full'},
          {path: 'BaranggayClearance', component: BaranggayClearance},
          {path: 'BaranggayIndigency', component: BaranggayIndigency},
          {path: 'BaranggayPermit', component: BaranggayPermit }
        ]
       },

      {
        path: 'profile',
      component: Profile,
      children: [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        { path: 'overview', component: ProfileOverview },
        { path: 'my-information', component: ProfileMyInformation },
        { path: 'account-settings', component: ProfileAccountSettings },
        { path: 'help', component: ProfileHelp }
      ]
      },
    ],
  },

];