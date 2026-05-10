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

// CHANGE: Removed Firebase Storage dependency completely

@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  private firestore = inject(Firestore);
  private ref = collection(this.firestore, 'residents');

  getAll() {
    return collectionData(this.ref, { idField: 'id' });
  }

  add(data: Resident) {

    // CHANGE: remove any file/temp fields before saving
    delete (data as any).selectedFile;
    delete (data as any).photoPreview;

    return addDoc(this.ref, {
      ...data,
      isArchived: false,
      createdAt: serverTimestamp()
    });
  }

  update(id: string, data: Partial<Resident>) {

    // CHANGE: cleanup before update
    delete (data as any).selectedFile;
    delete (data as any).photoPreview;

    const docRef = doc(this.firestore, 'residents', id);
    return updateDoc(docRef, data);
  }

  getById(id: string) {
    const docRef = doc(this.firestore, `residents/${id}`);
    return docData(docRef, { idField: 'id' });
  }
}
