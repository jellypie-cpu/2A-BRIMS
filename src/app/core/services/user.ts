import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');

  getUsers(): Observable<AppUser[]> {
    return collectionData(this.usersCollection, {
      idField: 'id'
    }) as Observable<AppUser[]>;
  }

  getUserById(id: string): Observable<AppUser> {
    const userDoc = doc(this.firestore, `users/${id}`);

    return docData(userDoc, {
      idField: 'id'
    }) as Observable<AppUser>;
  }

  async addUser(user: AppUser) {
    if (!user.id || !user.username || !user.email || !user.role) {
      throw new Error('Complete user credentials are required before saving.');
    }

    const userDoc = doc(this.firestore, `users/${user.id}`);

    await setDoc(userDoc, {
      username: user.username,
      email: user.email,
      role: user.role,
      residentId: user.residentId || null,
      profileImage: user.profileImage || '',
      activityLogs: [
        {
          action: 'Account created',
          time: new Date()
        }
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return user.id;
  }

  async updateUser(id: string, data: Partial<AppUser>) {
    const userDoc = doc(this.firestore, `users/${id}`);

    return updateDoc(userDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  async deleteUser(id: string) {
    const userDoc = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDoc);
  }

  async saveProfileImageAsBase64(userId: string, base64Image: string) {
    await this.updateUser(userId, {
      profileImage: base64Image
    });

    return base64Image;
  }

  async addActivityLog(userId: string, action: string) {
    const userDoc = doc(this.firestore, `users/${userId}`);
    const snapshot = await getDoc(userDoc);

    const currentUser = snapshot.data() as AppUser;
    const logs = currentUser.activityLogs || [];

    logs.unshift({
      action,
      time: new Date()
    });

    await updateDoc(userDoc, {
      activityLogs: logs,
      updatedAt: serverTimestamp()
    });
  }
}