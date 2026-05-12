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
import { DocumentRequest } from '../models/documentRequest.model';
import { NotificationService } from './notifications';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private firestore = inject(Firestore);
  private notificationService = inject(NotificationService);
  private requestRef = collection(this.firestore, 'requests');

  getAll(): Observable<DocumentRequest[]> {
    return (collectionData(this.requestRef, { idField: 'id' }) as Observable<DocumentRequest[]>).pipe(
      map(requests => this.sortByNewest(requests || []))
    );
  }

  async create(
    residentId: string,
    type: DocumentRequest['type'],
    residentName = '',
    residentEmail = ''
  ) {
    const requestDoc = await addDoc(this.requestRef, {
      residentId,
      residentName,
      residentEmail,
      type,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await this.notificationService.createDocumentRequestNotification(
      residentName,
      type,
      requestDoc.id
    );

    return requestDoc;
  }

  getPending(): Observable<DocumentRequest[]> {
    const q = query(this.requestRef, where('status', '==', 'pending'));

    return (collectionData(q, { idField: 'id' }) as Observable<DocumentRequest[]>).pipe(
      map(requests => this.sortByNewest(requests || []))
    );
  }

  async updateStatus(id: string, status: DocumentRequest['status']) {
    const requestDoc = doc(this.firestore, `requests/${id}`);

    return updateDoc(requestDoc, {
      status,
      updatedAt: serverTimestamp()
    });
  }

  private sortByNewest(requests: DocumentRequest[]): DocumentRequest[] {
    return [...requests].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.toMillis?.() ?? b.createdAt?.seconds ?? 0;
      return bTime - aTime;
    });
  }
}