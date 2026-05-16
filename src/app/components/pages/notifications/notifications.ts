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
  statusFilter: 'all' | 'read' | 'unread' = 'all';

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

  setTypeFilter(type: AppNotification['type'] | 'all'): void {
    this.selectedType = type;
    this.applyFilter();
  }

  setStatusFilter(status: 'all' | 'read' | 'unread'): void {
    this.statusFilter = status;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.notifications];

    if (this.selectedType !== 'all') {
      result = result.filter(notification => notification.type === this.selectedType);
    }

    if (this.statusFilter === 'read') {
      result = result.filter(notification => notification.isRead);
    }

    if (this.statusFilter === 'unread') {
      result = result.filter(notification => !notification.isRead);
    }

    this.filteredNotifications = result;
  }

  unreadCount(): number {
    return this.filteredNotifications.filter(notification => !notification.isRead).length;
  }

  getUnreadTotal(): number {
    return this.notifications.filter(notification => !notification.isRead).length;
  }

  getReadTotal(): number {
    return this.notifications.filter(notification => notification.isRead).length;
  }

  getNotificationIcon(type: AppNotification['type']): string {
    switch (type) {
      case 'document-request':
  return '📄';
      case 'concern':
        return '⚠️';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
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

  async markAllAsRead(): Promise<void> {
    const unreadNotifications = this.filteredNotifications.filter(
      notification => notification.id && !notification.isRead
    );

    for (const notification of unreadNotifications) {
      await this.notificationService.markAsRead(notification.id!);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  async openNotification(
  notification: AppNotification,
  event: Event
): Promise<void> {
  event.stopPropagation();
  await this.open(notification);
}
}