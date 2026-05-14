import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  filteredNotifications: AppNotification[] = [];
  loading = true;
  selectedType: AppNotification['type'] | 'all' = 'all';

  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.subscription.add(
      this.route.queryParamMap.subscribe(params => {
        this.selectedType = (params.get('type') as AppNotification['type']) || 'all';
        this.applyFilter();
      })
    );

    this.subscription.add(
      this.notificationService.getForRole(user.role, false).subscribe({
        next: notifications => {
          this.notifications = notifications || [];
          this.applyFilter();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      })
    );
  }

  applyFilter(): void {
    this.filteredNotifications =
      this.selectedType === 'all'
        ? this.notifications
        : this.notifications.filter(n => n.type === this.selectedType);
  }

  unreadCount(): number {
    return this.filteredNotifications.filter(notification => !notification.isRead).length;
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