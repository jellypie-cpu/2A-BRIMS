import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppUser, UserRole } from '../models/user.model';

export interface LoginRecord {
  username: string;
  role: UserRole;
  loginTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private loginHistory: LoginRecord[] = [];

  constructor() {
    this.loadSession();
  }

  // LOGIN
  login(user: AppUser) {
    this.currentUserSubject.next(user);

    localStorage.setItem('currentUser', JSON.stringify(user));

    this.loginHistory.push({
      username: user.username,
      role: user.role,
      loginTime: new Date()
    });
  }

  // LOGOUT
  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  // GET CURRENT USER
  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.getValue();
  }

  // LOGIN HISTORY
  getLoginHistory(): LoginRecord[] {
    return this.loginHistory;
  }

  // RESTORE SESSION
  private loadSession() {
    const data = localStorage.getItem('currentUser');

    if (data) {
      this.currentUserSubject.next(JSON.parse(data));
    }
  }
getTodaysLogins(): number {
  const today = new Date();

  return this.loginHistory.filter(record => {
    const login = new Date(record.loginTime);

    return (
      login.getFullYear() === today.getFullYear() &&
      login.getMonth() === today.getMonth() &&
      login.getDate() === today.getDate()
    );
  }).length;
}
getUserRole(): UserRole | '' {
  const user = this.getCurrentUser();
  return user ? user.role : '';
}
}