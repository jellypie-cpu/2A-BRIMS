import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
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
    return collectionData(this.residentsRef, {
      idField: 'id'
    }) as Observable<Resident[]>;
  }

  getActive(): Observable<Resident[]> {
    const q = query(
      this.residentsRef,
      where('isArchived', '==', false)
    );

    return collectionData(q, {
      idField: 'id'
    }) as Observable<Resident[]>;
  }

  getArchived(): Observable<Resident[]> {
    const q = query(
      this.residentsRef,
      where('isArchived', '==', true)
    );

    return collectionData(q, {
      idField: 'id'
    }) as Observable<Resident[]>;
  }

  getById(id: string): Observable<Resident> {
    return docData(doc(this.firestore, `residents/${id}`), {
      idField: 'id'
    }) as Observable<Resident>;
  }

  async saveResident(data: Resident): Promise<void> {
    const cleanData = this.cleanResidentData(data);

    if (data.id) {
      const residentDoc = doc(this.firestore, `residents/${data.id}`);

      await setDoc(
        residentDoc,
        {
          ...cleanData,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      return;
    }

    const residentNumber = await this.generateUniqueResidentNumber();

    await addDoc(this.residentsRef, {
      ...cleanData,
      residentNumber,
      userId: data.userId || null,
      userEmail: data.userEmail || null,
      isArchived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  update(id: string, data: Partial<Resident>): Promise<void> {
    const cleanData = this.cleanResidentData(data);

    return updateDoc(doc(this.firestore, `residents/${id}`), {
      ...cleanData,
      updatedAt: serverTimestamp()
    });
  }

  archive(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, `residents/${id}`), {
      isArchived: true,
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  restore(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, `residents/${id}`), {
      isArchived: false,
      restoredAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  private async generateUniqueResidentNumber(): Promise<string> {
    let residentNumber = '';
    let exists = true;

    while (exists) {
      residentNumber = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

      const q = query(
        this.residentsRef,
        where('residentNumber', '==', residentNumber)
      );

      const snapshot = await getDocs(q);
      exists = !snapshot.empty;
    }

    return residentNumber;
  }

  private cleanResidentData(data: Partial<Resident>) {
    const cleanData: any = { ...data };

    delete cleanData.selectedFile;
    delete cleanData.photoPreview;

    if (cleanData.address?.zone !== undefined) {
      cleanData.address = {
        ...cleanData.address,
        zone: String(cleanData.address.zone),
        barangay: 'San Martin'
      };
    }

    return cleanData;
  }
}