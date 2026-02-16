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

  menu: { label: string; link: string; icon: string }[] = [];

  constructor(private auth: AuthService) {
    const user: User | null = this.auth.getCurrentUser();
    if (!user) return;

    if (user.role === 'admin') {
      this.menu = [
        { label: 'Dashboard', link: '/dashboard', icon: '🏠' },
        { label: 'Reports', link: '/dashboard/reports', icon: '📄' },
        { label: 'Manage Users', link: '/dashboard/users', icon: '👥' },
      ];
    } else if (user.role === 'staff') {
      this.menu = [
        { label: 'Dashboard', link: '/dashboard', icon: '🏠' },
        { label: 'Residents', link: '/dashboard/residents', icon: '👤' },
      ];
    } else {
      this.menu = [
        { label: 'Dashboard', link: '/dashboard', icon: '🏠' },
      ];
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
