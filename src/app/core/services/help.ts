import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private helpRef = collection(this.firestore, 'help_tickets');

  // CREATE HELP TICKET
  async createTicket(ticket: any) {

    const user = this.auth.currentUser;

    return addDoc(this.helpRef, {
      ...ticket,
      userId: user?.uid || null,
      email: user?.email || null,
      status: 'Pending'
    });
  }

  // GET ONLY CURRENT USER TICKETS
  getUserTickets(): Observable<any[]> {

    const user = this.auth.currentUser;

    const q = query(
      this.helpRef,
      where('userId', '==', user?.uid)
    );

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
}