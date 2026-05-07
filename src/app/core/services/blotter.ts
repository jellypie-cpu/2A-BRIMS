import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlotterService {

  private firestore = inject(Firestore);
  private blotterRef = collection(this.firestore, 'blotters');

  // GET ALL
  getAll(): Observable<any[]> {
    return collectionData(this.blotterRef, { idField: 'id' }) as Observable<any[]>;
  }

  // ADD
  async add(data: any) {
    return await addDoc(this.blotterRef, {
      ...data,
      createdAt: serverTimestamp()
    });
  }

  // UPDATE
  async update(id: string, data: any) {
    const ref = doc(this.firestore, `blotters/${id}`);
    return updateDoc(ref, data);
  }

  // DELETE
  async delete(id: string) {
    const ref = doc(this.firestore, `blotters/${id}`);
    return deleteDoc(ref);
  }
}