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
  orderBy,
  serverTimestamp
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

export interface AppNotification {
  id?: string;
  title: string;
  message: string;
  type: 'concern' | 'system' | 'resident';
  targetRoles: string[];
  isRead: boolean;
  createdAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private firestore = inject(Firestore);
  private notificationsRef = collection(this.firestore, 'notifications');

  getForRole(role: string): Observable<AppNotification[]> {
    const q = query(
      this.notificationsRef,
      where('targetRoles', 'array-contains', role),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }) as Observable<AppNotification[]>;
  }

  createConcernNotification(name: string, message: string) {
    return addDoc(this.notificationsRef, {
      title: 'New Concern Message',
      message: `${name}: ${message}`,
      type: 'concern',
      targetRoles: ['admin', 'staff'],
      isRead: false,
      createdAt: serverTimestamp()
    });
  }

  markAsRead(id: string) {
    const notificationDoc = doc(this.firestore, `notifications/${id}`);

    return updateDoc(notificationDoc, {
      isRead: true
    });
  }
}