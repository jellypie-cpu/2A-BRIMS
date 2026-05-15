import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  styleUrl: './topbar.scss'
})
export class TopbarComponent implements OnDestroy {
  currentUser: AppUser | null = null;

  username = '';
  userRole = '';
  showDropdown = false;

  showNotificationDialog = false;
  notifications: AppNotification[] = [];
  notificationCount = 0;

  private subscription = new Subscription();
  private notificationSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.subscription.add(
      this.authService.currentUser$.subscribe((user: AppUser | null) => {
        this.notificationSubscription?.unsubscribe();

        if (user) {
          this.currentUser = user;
          this.username = user.username || '';
          this.userRole = user.role || '';
          this.loadNotifications(user.role);
          return;
        }

        this.currentUser = null;
        this.username = '';
        this.userRole = '';
        this.notifications = [];
        this.notificationCount = 0;

        this.router.navigate(['/login']);
      })
    );
  }

  loadNotifications(role: string): void {
    this.notificationSubscription = this.notificationService
      .getForRole(role, false)
      .subscribe(notifications => {
        this.notifications = notifications || [];
        this.notificationCount = this.notifications.filter(n => !n.isRead).length;
      });
  }

  toggleNotificationDialog(): void {
    this.showNotificationDialog = !this.showNotificationDialog;
    this.showDropdown = false;
  }

  closeNotificationDialog(): void {
    this.showNotificationDialog = false;
  }

  async openNotification(notification: AppNotification): Promise<void> {
    if (notification.id && !notification.isRead) {
      await this.notificationService.markAsRead(notification.id);
    }

    this.showNotificationDialog = false;

    if (notification.route) {
      await this.router.navigate([notification.route]);
    }
  }

  async markAsRead(notification: AppNotification, event: Event): Promise<void> {
    event.stopPropagation();

    if (!notification.id || notification.isRead) return;

    await this.notificationService.markAsRead(notification.id);
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    this.showNotificationDialog = false;
  }

  goToProfile(): void {
    this.router.navigate(['/dashboard/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.notificationSubscription?.unsubscribe();
  }
}