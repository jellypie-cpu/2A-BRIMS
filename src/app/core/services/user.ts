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

import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore = inject(Firestore);
  private storage = inject(Storage);

  private usersCollection = collection(this.firestore, 'users');

  ///get all users
  getUsers(): Observable<AppUser[]> {
    return collectionData(this.usersCollection, {
      idField: 'id'
    }) as Observable<AppUser[]>;
  }

  ///get user by id
  getUserById(id: string): Observable<AppUser> {

    const userDoc = doc(this.firestore, `users/${id}`);

    return docData(userDoc, {
      idField: 'id'
    }) as Observable<AppUser>;
  }

  ///add user
  async addUser(user: AppUser) {

    const userDoc = doc(this.firestore, `users/${user.id}`);

    await setDoc(userDoc, {
      username: user.username,
      email: user.email,
      role: user.role,
      residentId: user.residentId || null,

      profileImage: '',

      activityLogs: [
        {
          action: 'Account created',
          time: new Date()
        }
      ],

      createdAt: serverTimestamp()
    });

    return user.id;
  }

  ///update user
  async updateUser(id: string, data: Partial<AppUser>) {

    const userDoc = doc(this.firestore, `users/${id}`);

    return updateDoc(userDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  ///delete user
  async deleteUser(id: string) {

    const userDoc = doc(this.firestore, `users/${id}`);

    return deleteDoc(userDoc);
  }

  /// upload profile image
  async uploadProfileImage(userId: string, file: File) {

    const path = `profile-images/${userId}`;

    const storageRef = ref(this.storage, path);

    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    await this.updateUser(userId, {
      profileImage: downloadURL
    });

    return downloadURL;
  }

  /// add activity log
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