import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private firestore = inject(Firestore);
  private certRef = collection(this.firestore, 'certificates');

  getAll(): Observable<any[]> {
    return collectionData(this.certRef, { idField: 'id' }) as Observable<any[]>;
  }

  async add(cert: any) {
    return await addDoc(this.certRef, {
      ...cert,
      createdAt: new Date()
    });
  }

  async update(id: string, data: any) {
    const ref = doc(this.firestore, `certificates/${id}`);
    return updateDoc(ref, data);
  }
}