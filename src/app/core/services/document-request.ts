import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  serverTimestamp
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private firestore = inject(Firestore);

  private requestRef = collection(this.firestore, 'requests');

  // GET ALL
  getAll(): Observable<any[]> {
    return collectionData(this.requestRef, {
      idField: 'id'
    }) as Observable<any[]>;
  }

  // CREATE REQUEST
  async create(residentId: string, type: string) {

    return await addDoc(this.requestRef, {
      residentId,
      type,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  }

  // GET PENDING
  getPending(): Observable<any[]> {

    const q = query(
      this.requestRef,
      where('status', '==', 'pending')
    );

    return collectionData(q, {
      idField: 'id'
    }) as Observable<any[]>;
  }

  // UPDATE STATUS
  async updateStatus(id: string, status: string) {

    const requestDoc = doc(this.firestore, `requests/${id}`);

    return await updateDoc(requestDoc, {
      status
    });
  }
}