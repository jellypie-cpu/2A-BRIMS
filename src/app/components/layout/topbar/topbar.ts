import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../../core/services/auth';
import { AppUser } from '../../../core/models/user.model';
import {
  NotificationService,
  AppNotification
} from '../../../core/services/notifications';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class TopbarComponent implements OnDestroy {
  username = '';
  showDropdown = false;
  userRole: string | null = null;

  notifications: AppNotification[] = [];
  notificationCount = 0;
  showNotifications = false;

  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.subscription.add(
      this.authService.currentUser$.subscribe((user: AppUser | null) => {
        if (user) {
          this.username = user.username;
          this.userRole = user.role;
          this.loadNotifications(user.role);
          return;
        }

        this.router.navigate(['/login']);
      })
    );
  }

  loadNotifications(role: string): void {
    this.subscription.add(
      this.notificationService.getForRole(role).subscribe((notifications) => {
        this.notifications = notifications || [];
        this.notificationCount = this.notifications.length;
      })
    );
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  async markNotificationRead(notification: AppNotification): Promise<void> {
    if (!notification.id) return;

    await this.notificationService.markAsRead(notification.id);
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  goToProfile(): void {
    this.showDropdown = false;
    this.router.navigate(['/dashboard/profile']);
  }

  async logout(): Promise<void> {
    this.showDropdown = false;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}