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
import { Blotter } from '../models/blotter';

@Injectable({
  providedIn: 'root'
})
export class BlotterService {
  private firestore = inject(Firestore);
  private blotterRef = collection(this.firestore, 'blotters');

  getAll(): Observable<Blotter[]> {
    const q = query(
      this.blotterRef,
      where('isArchived', '==', false)
    );

    return collectionData(q, { idField: 'id' }) as Observable<Blotter[]>;
  }

  async add(data: Blotter) {
    return addDoc(this.blotterRef, {
      ...data,
      status: 'Active',
      isArchived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  async update(id: string, data: Partial<Blotter>) {
    const ref = doc(this.firestore, `blotters/${id}`);

    return updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  async archive(id: string) {
    const ref = doc(this.firestore, `blotters/${id}`);

    return updateDoc(ref, {
      isArchived: true,
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  getArchived(): Observable<Blotter[]> {
  const q = query(
    this.blotterRef,
    where('isArchived', '==', true)
  );

  return collectionData(q, { idField: 'id' }) as Observable<Blotter[]>;
}

async restore(id: string) {
  const ref = doc(this.firestore, `blotters/${id}`);

  return updateDoc(ref, {
    isArchived: false,
    restoredAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}
}