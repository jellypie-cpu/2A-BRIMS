import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
  serverTimestamp
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { SystemSettings } from '../models/system-settings';
@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {

  private firestore = inject(Firestore);

  private settingsDoc = doc(this.firestore, 'system/settings');

  // GET SETTINGS (REALTIME)
  getSettings(): Observable<SystemSettings> {
    return docData(this.settingsDoc) as Observable<SystemSettings>;
  }

  // CREATE DEFAULT SETTINGS (FIRST TIME SETUP)
  async initSettings() {

    return setDoc(this.settingsDoc, {
      barangayName: 'Barangay San Martin',
      municipality: 'Villanueva',
      province: 'Misamis Oriental',

      allowRegistration: true,
      maintenanceMode: false,

      updatedAt: serverTimestamp()
    });
  }

  // UPDATE SETTINGS
  async updateSettings(data: Partial<SystemSettings>) {

    return updateDoc(this.settingsDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
}