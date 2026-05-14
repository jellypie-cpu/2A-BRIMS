import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  UserCredential
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  getDoc,
  docData
} from '@angular/fire/firestore';

import { BehaviorSubject, Subscription } from 'rxjs';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private userDocSubscription?: Subscription;

  constructor() {
    this.restoreUser();
  }

  async login(email: string, password: string): Promise<AppUser> {
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

    this.listenToUserDocument(uid);

    return {
      id: uid,
      ...snapshot.data()
    } as AppUser;
  }

  async createAuthAccount(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  async logout(): Promise<void> {
    this.userDocSubscription?.unsubscribe();
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  private restoreUser(): void {
    onAuthStateChanged(this.auth, firebaseUser => {
      this.userDocSubscription?.unsubscribe();

      if (!firebaseUser) {
        this.currentUserSubject.next(null);
        return;
      }

      this.listenToUserDocument(firebaseUser.uid);
    });
  }

  private listenToUserDocument(uid: string): void {
    const userRef = doc(this.firestore, `users/${uid}`);

    this.userDocSubscription?.unsubscribe();

    this.userDocSubscription = docData(userRef, {
      idField: 'id'
    }).subscribe(user => {
      if (!user) {
        this.currentUserSubject.next(null);
        return;
      }

      this.currentUserSubject.next(user as AppUser);
    });
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): UserRole | '' {
    return this.currentUserSubject.value?.role || '';
  }
}