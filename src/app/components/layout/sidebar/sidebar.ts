import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService} from '../../../core/services/auth';
import { CommonModule, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AppUser } from '../../../core/models/user.model';

interface MenuItem {
  label: string;
  routerLink?: string;
  icon?: string;
  subMenu?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NgIf, ButtonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent {
  isCollapsed = false;

  menu: MenuItem[] = [];

  constructor(private auth: AuthService) {
    const user: AppUser | null = this.auth.getCurrentUser();
    if (!user) return;

    if (user.role === 'admin') {
      this.menu = [
        { label: 'Dashboard', routerLink: '/dashboard', icon: 'pi pi-home' },
        { label: 'Residents Information', routerLink: '/dashboard/residents-information', icon: 'pi pi-users' },
        { 
          label: 'Barangay Certificates', 
          icon: 'pi pi-file', 
          subMenu: [
            { label: 'Barangay Clearance', routerLink: '/dashboard/barangay-certificates/BaranggayClearance' },
            { label: 'Barangay Indigency', routerLink: '/dashboard/barangay-certificates/BaranggayIndigency' },
            { label: 'Barangay Permit', routerLink: '/dashboard/barangay-certificates/BaranggayPermit' }
          ]
        },
        { label: 'Certificate Requests', routerLink: '/dashboard/certificates-request', icon: 'pi pi-envelope' },
        { label: 'Blotter Records', routerLink: '/dashboard/blotter-records', icon: 'pi pi-pencil' },
        { label: 'Manage Users', routerLink: '/dashboard/users', icon: 'pi pi-user-edit' },
        { label: 'Settings', routerLink: '/dashboard/system-settings', icon: 'pi pi-cog' }
      ];
    } else if (user.role === 'staff') {
      this.menu = [
        { label: 'Dashboard', routerLink: '/dashboard', icon: 'pi pi-home' },
        { label: 'Residents Information', routerLink: '/dashboard/residents-information', icon: 'pi pi-users' },
        { 
          label: 'Barangay Certificates', 
          icon: 'pi pi-file', 
          subMenu: [
            { label: 'Barangay Clearance', routerLink: '/dashboard/barangay-certificates/BaranggayClearance' },
            { label: 'Barangay Indigency', routerLink: '/dashboard/barangay-certificates/BaranggayIndigency' },
            { label: 'Barangay Permit', routerLink: '/dashboard/barangay-certificates/BaranggayPermit' }
          ]
        },
        { label: 'Certificate Requests', routerLink: '/dashboard/certificates-request', icon: 'pi pi-envelope' },
        { label: 'Blotter Records', routerLink: '/dashboard/blotter-records', icon: 'pi pi-pencil' },
        { label: 'Settings', routerLink: '/dashboard/system-settings', icon: 'pi pi-cog' }
      ];
    } else {
  this.menu = [
    {
      label: 'Dashboard',
      routerLink: '/dashboard',
      icon: 'pi pi-home'
    },
    {
      label: 'My Profile',
      routerLink: '/dashboard/my-profile',
      icon: 'pi pi-user'
    },
    {
      label: 'Request Documents',
      icon: 'pi pi-file',
      subMenu: [
        {
          label: 'Barangay Clearance',
          routerLink: '/dashboard/request/barangay-clearance'
        },
        {
          label: 'Barangay Indigency',
          routerLink: '/dashboard/request/barangay-indigency'
        },
        {
          label: 'Business Permit',
          routerLink: '/dashboard/request/business-permit'
        }
      ]
    },
    {
      label: 'My Request History',
      routerLink: '/dashboard/my-requests',
      icon: 'pi pi-history'
    }
  ];
}
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}