import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  private storage = inject(Storage);

  async uploadResidentPhoto(file: File, residentId: string) {

    const path =
  `resident-photos/${residentId}/${Date.now()}`;

    const storageRef = ref(this.storage, path);

    await uploadBytes(storageRef, file);

    return await getDownloadURL(storageRef);
  }
}