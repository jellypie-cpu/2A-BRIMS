import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth';
import { NotificationService, AppNotification } from '../../../core/services/notifications';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class Notifications implements OnInit, OnDestroy {
  notifications: AppNotification[] = [];
  loading = true;

  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.subscription.add(
      this.notificationService.getForRole(user.role, false).subscribe({
        next: notifications => {
          this.notifications = notifications || [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      })
    );
  }

  unreadCount(): number {
    return this.notifications.filter(notification => !notification.isRead).length;
  }

  async open(notification: AppNotification): Promise<void> {
    if (notification.id && !notification.isRead) {
      await this.notificationService.markAsRead(notification.id);
    }

    await this.router.navigate([notification.route || '/dashboard/notifications']);
  }

  async markRead(notification: AppNotification, event: Event): Promise<void> {
    event.stopPropagation();

    if (!notification.id || notification.isRead) return;
    await this.notificationService.markAsRead(notification.id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}