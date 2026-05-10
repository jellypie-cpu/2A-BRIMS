import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp
} from '@angular/fire/firestore';

import { NotificationService } from './notifications';
@Injectable({
  providedIn: 'root'
})
export class ConcernService {
  private firestore = inject(Firestore);
  private concernsRef = collection(this.firestore, 'concerns');

  constructor(private notificationService: NotificationService) {}

  async sendConcern(data: {
    name: string;
    email: string;
    message: string;
  }) {
    await addDoc(this.concernsRef, {
      ...data,
      status: 'new',
      createdAt: serverTimestamp()
    });

    await this.notificationService.createConcernNotification(
      data.name,
      data.message
    );
  }
}