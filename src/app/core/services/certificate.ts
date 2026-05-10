import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private firestore = inject(Firestore);
  private ref = collection(this.firestore, 'certificates');

  getAll() {
    return collectionData(this.ref, { idField: 'id' });
  }

  add(cert: any) {
    return addDoc(this.ref, {
      ...cert,
      status: cert.status ?? 'pending',
      createdAt: serverTimestamp()
    });
  }

  update(id: string, data: any) {
    const docRef = doc(this.firestore, `certificates/${id}`);
    return updateDoc(docRef, data);
  }
}