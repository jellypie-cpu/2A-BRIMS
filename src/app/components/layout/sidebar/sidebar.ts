import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NgIf],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent {
  isCollapsed = false; // Sidebar starts expanded

  menu: { label: string; routerLink: string; icon: string }[] = [];

  constructor(private auth: AuthService) {
    const user: User | null = this.auth.getCurrentUser();
    if (!user) return;

    if (user.role === 'admin') {
  this.menu = [
    { label: 'Dashboard', routerLink: '/dashboard', icon: '🏠' },
    { label: 'Residents Information', routerLink: '/dashboard/resident-infor', icon: '📄' },
    { label: 'Barangay Certificates', routerLink: '/dashboard/brngy-cer', icon: '📜' },
    { label: 'Certificate Requests', routerLink: '/dashboard/coi', icon: '📬' },
    { label: 'Blotter Records', routerLink: '/dashboard/blotter-records', icon: '📝' },
    { label: 'Manage Users', routerLink: '/dashboard/users', icon: '👥' },
    { label: 'Settings', routerLink: '/dashboard/system-info', icon: '⚙️' },
  ];
    } else if (user.role === 'staff') {
      this.menu = [
        { label: 'Dashboard', routerLink: '/dashboard', icon: '🏠' },
        { label: 'Residents Information', routerLink: '/dashboard/residents-infor', icon: '👤' },
      ];
    } else {
      this.menu = [
        { label: 'Dashboard', routerLink: '/dashboard', icon: '🏠' },
      ];
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
