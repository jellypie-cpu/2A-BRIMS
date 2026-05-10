import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  orderBy,
  serverTimestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {

  private firestore = inject(Firestore);

  private logsRef = collection(this.firestore, 'activity_logs');

  // ADD LOG
  async addLog(userId: string, action: string) {

    return await addDoc(this.logsRef, {
      userId,
      action,
      createdAt: serverTimestamp()
    });
  }

  // GET USER LOGS
  getLogs(userId: string): Observable<any[]> {

    const q = query(
      this.logsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, {
      idField: 'id'
    }) as Observable<any[]>;
  }
}