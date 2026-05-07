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
  serverTimestamp
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');

  // GET ALL USERS
  getUsers(): Observable<AppUser[]> {
    return collectionData(this.usersCollection, {
      idField: 'id'
    }) as Observable<AppUser[]>;
  }

  // GET SINGLE USER
  getUserById(id: string): Observable<AppUser> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return docData(userDoc, { idField: 'id' }) as Observable<AppUser>;
  }

  // ADD USER (must use UID from Firebase Auth)
  async addUser(user: AppUser) {
    const userDoc = doc(this.firestore, `users/${user.id}`);

    await setDoc(userDoc, {
      username: user.username,
      email: user.email,
      role: user.role,
      residentId: user.residentId || null,
      createdAt: serverTimestamp()
    });

    return user.id;
  }

  // UPDATE USER
  async updateUser(id: string, data: Partial<AppUser>) {
    const userDoc = doc(this.firestore, `users/${id}`);

    return updateDoc(userDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  // DELETE USER
  async deleteUser(id: string) {
    const userDoc = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDoc);
  }
}