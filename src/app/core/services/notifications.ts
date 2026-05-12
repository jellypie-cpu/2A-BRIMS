import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp
} from '@angular/fire/firestore';

import { Observable, map } from 'rxjs';
import { UserRole } from '../models/user.model';

export interface AppNotification {
  id?: string;
  title: string;
  message: string;
  type: 'concern' | 'system' | 'resident' | 'document-request';
  targetRoles: UserRole[];
  isRead: boolean;
  route?: string;
  data?: Record<string, any>;
  createdAt?: any;
  readAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private firestore = inject(Firestore);
  private notificationsRef = collection(this.firestore, 'notifications');

  getForRole(role: UserRole | string, unreadOnly = true): Observable<AppNotification[]> {
    const normalizedRole = String(role).toLowerCase() as UserRole;

    const q = unreadOnly
      ? query(
          this.notificationsRef,
          where('targetRoles', 'array-contains', normalizedRole),
          where('isRead', '==', false)
        )
      : query(
          this.notificationsRef,
          where('targetRoles', 'array-contains', normalizedRole)
        );

    return (collectionData(q, { idField: 'id' }) as Observable<AppNotification[]>).pipe(
      map(notifications => this.sortByNewest(notifications || []))
    );
  }

  getUnreadCountForRole(role: UserRole | string): Observable<number> {
    return this.getForRole(role, true).pipe(
      map(notifications => notifications.length)
    );
  }

  async create(
    notification: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'> &
      Partial<Pick<AppNotification, 'isRead'>>
  ) {
    return addDoc(this.notificationsRef, {
      ...notification,
      targetRoles: notification.targetRoles.map(role => String(role).toLowerCase()),
      isRead: notification.isRead ?? false,
      createdAt: serverTimestamp()
    });
  }

  createConcernNotification(name: string, message: string) {
    return this.create({
      title: 'New Concern Message',
      message: `${name}: ${message}`,
      type: 'concern',
      targetRoles: ['admin', 'staff'],
      route: '/dashboard/notifications'
    });
  }

  createDocumentRequestNotification(
    residentName: string,
    requestType: string,
    requestId?: string
  ) {
    return this.create({
      title: 'New Certificate Request',
      message: `${residentName || 'A resident'} requested ${requestType}.`,
      type: 'document-request',
      targetRoles: ['admin', 'staff'],
      route: '/dashboard/certificates-request',
      data: { requestId }
    });
  }

  markAsRead(id: string) {
    const notificationDoc = doc(this.firestore, `notifications/${id}`);

    return updateDoc(notificationDoc, {
      isRead: true,
      readAt: serverTimestamp()
    });
  }

  private sortByNewest(notifications: AppNotification[]): AppNotification[] {
    return [...notifications].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.toMillis?.() ?? b.createdAt?.seconds ?? 0;
      return bTime - aTime;
    });
  }
}