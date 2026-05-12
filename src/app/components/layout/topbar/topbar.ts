import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth';
import { AppUser } from '../../../core/models/user.model';
import { NotificationService, AppNotification } from '../../../core/services/notifications';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class TopbarComponent implements OnDestroy {
  username = '';
  userRole = '';
  showDropdown = false;

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
          this.username = user.username;
          this.userRole = user.role;
          this.loadNotifications(user.role);
          return;
        }

        this.notifications = [];
        this.notificationCount = 0;
        this.router.navigate(['/login']);
      })
    );
  }

  loadNotifications(role: string): void {
    this.notificationSubscription = this.notificationService.getForRole(role).subscribe(notifications => {
      this.notifications = notifications || [];
      this.notificationCount = this.notifications.length;
    });
  }

  goToNotifications(): void {
    if (this.userRole === 'admin' || this.userRole === 'staff') {
      this.router.navigate(['/dashboard/notifications']);
      return;
    }

    this.router.navigate(['/dashboard']);
  }

  async openNotification(notification: AppNotification): Promise<void> {
    if (notification.id) {
      await this.notificationService.markAsRead(notification.id);
    }

    await this.router.navigate([notification.route || '/dashboard/notifications']);
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
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