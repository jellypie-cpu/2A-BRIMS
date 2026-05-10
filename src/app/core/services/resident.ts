import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  docData,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Resident } from '../models/resident.model';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  private firestore = inject(Firestore);
  private residentsRef = collection(this.firestore, 'residents');

  getAll(): Observable<Resident[]> {
    const q = query(this.residentsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Resident[]>;
  }

  getActive(): Observable<Resident[]> {
    const q = query(
      this.residentsRef,
      where('isArchived', '==', false),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }) as Observable<Resident[]>;
  }

  getArchived(): Observable<Resident[]> {
    const q = query(
      this.residentsRef,
      where('isArchived', '==', true),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }) as Observable<Resident[]>;
  }

  getById(id: string): Observable<Resident> {
    const docRef = doc(this.firestore, `residents/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Resident>;
  }

  add(data: Resident) {
    const cleanData = this.cleanResidentData(data);

    return addDoc(this.residentsRef, {
      ...cleanData,
      isArchived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  update(id: string, data: Partial<Resident>) {
    const cleanData = this.cleanResidentData(data);
    const docRef = doc(this.firestore, 'residents', id);

    return updateDoc(docRef, {
      ...cleanData,
      updatedAt: serverTimestamp()
    });
  }

  archive(id: string) {
    return this.update(id, { isArchived: true });
  }

  restore(id: string) {
    return this.update(id, { isArchived: false });
  }

  private cleanResidentData<T extends Partial<Resident>>(data: T): T {
    const cleanData: any = { ...data };

    delete cleanData.id;
    delete cleanData.selectedFile;
    delete cleanData.photoPreview;

    if (cleanData.address?.zone !== undefined) {
      cleanData.address = {
        ...cleanData.address,
        zone: String(cleanData.address.zone)
      };
    }

    return cleanData;
  }
}