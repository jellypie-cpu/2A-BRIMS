import { Injectable, inject } from '@angular/core';
import { serverTimestamp } from 'firebase/firestore';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  docData,
  deleteDoc,
  updateDoc,
  query,
  where
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  private firestore = inject(Firestore);
  private residentsRef = collection(this.firestore, 'residents');

  // GET ALL
  getAll(): Observable<any[]> {
    return collectionData(this.residentsRef, {
      idField: 'id'
    }) as Observable<any[]>;
  }

  // GET BY ID
  getById(id: string): Observable<any> {
    const residentDoc = doc(this.firestore, `residents/${id}`);

    return docData(residentDoc, {
      idField: 'id'
    }) as Observable<any>;
  }

  // GET BY USER ID
  getByUserId(userId: string): Observable<any[]> {

    const q = query(
      this.residentsRef,
      where('userId', '==', userId)
    );

    return collectionData(q, {
      idField: 'id'
    }) as Observable<any[]>;
  }

  // ADD
  async add(resident: any) {
    return await addDoc(this.residentsRef, {
      ...resident,
      createdAt: serverTimestamp()
    });
  }

  // UPDATE
  async update(id: string, data: any) {

    const ref = doc(this.firestore, `residents/${id}`);

    return updateDoc(ref, data);
  }

  // DELETE
  async delete(id: string) {

    const ref = doc(this.firestore, `residents/${id}`);

    return deleteDoc(ref);
  }
  async archive(id: string) {
  const ref = doc(this.firestore, `residents/${id}`);
  return updateDoc(ref, { isArchived: true });
}

async restore(id: string) {
  const ref = doc(this.firestore, `residents/${id}`);
  return updateDoc(ref, { isArchived: false });
}
}