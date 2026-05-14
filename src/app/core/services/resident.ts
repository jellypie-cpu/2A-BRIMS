import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Resident } from '../models/resident.model';

@Injectable({ providedIn: 'root' })
export class ResidentService {
  private firestore = inject(Firestore);
  private residentsRef = collection(this.firestore, 'residents');

  getAll(): Observable<Resident[]> {
    return collectionData(this.residentsRef, { idField: 'id' }) as Observable<Resident[]>;
  }

  getActive(): Observable<Resident[]> {
    const q = query(this.residentsRef, where('isArchived', '==', false));
    return collectionData(q, { idField: 'id' }) as Observable<Resident[]>;
  }

  getArchived(): Observable<Resident[]> {
    const q = query(this.residentsRef, where('isArchived', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<Resident[]>;
  }

  getById(id: string): Observable<Resident> {
    return docData(doc(this.firestore, `residents/${id}`), {
      idField: 'id'
    }) as Observable<Resident>;
  }

  saveResident(data: Resident) {
    if (!data.userId) {
      throw new Error('Resident must be linked to a user account.');
    }

    const cleanData = this.cleanResidentData(data);
    const residentDoc = doc(this.firestore, `residents/${data.userId}`);

    return setDoc(
      residentDoc,
      {
        ...cleanData,
        id: data.userId,
        userId: data.userId,
        residentId: data.userId,
        isArchived: data.isArchived ?? false,
        createdAt: data.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  }

  update(id: string, data: Partial<Resident>) {
    const cleanData = this.cleanResidentData(data);
    return updateDoc(doc(this.firestore, `residents/${id}`), {
      ...cleanData,
      updatedAt: serverTimestamp()
    });
  }

  archive(id: string) {
    return updateDoc(doc(this.firestore, `residents/${id}`), {
      isArchived: true,
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  restore(id: string) {
    return updateDoc(doc(this.firestore, `residents/${id}`), {
      isArchived: false,
      restoredAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  private cleanResidentData(data: Partial<Resident>) {
    const cleanData: any = { ...data };

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