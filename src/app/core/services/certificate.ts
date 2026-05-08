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
  private certRef = collection(this.firestore, 'certificates');

  getAll() {
    return collectionData(this.certRef, { idField: 'id' });
  }

  async add(cert: any) {
    return await addDoc(this.certRef, {
      ...cert,
      createdAt: serverTimestamp(),
      status: cert.status || 'issued'
    });
  }

  async update(id: string, data: any) {
    const ref = doc(this.firestore, `certificates/${id}`);
    return updateDoc(ref, data);
  }
}