import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  getDoc
} from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.restoreUser();
  }

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const uid = credential.user.uid;

    const userRef = doc(this.firestore, `users/${uid}`);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await signOut(this.auth);
      throw new Error('User profile missing in Firestore');
    }

    const userData = snapshot.data() as AppUser;

    this.currentUserSubject.next({
      id: uid,
      ...userData
    });

    return userData;
  }

  async logout() {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  private restoreUser() {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (!firebaseUser) {
        this.currentUserSubject.next(null);
        return;
      }

      const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.data() as AppUser;

        this.currentUserSubject.next({
          id: firebaseUser.uid,
          ...userData
        });
      }
    });
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): UserRole | '' {
    return this.currentUserSubject.value?.role || '';
  }
}