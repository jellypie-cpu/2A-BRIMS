import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'admin' | 'staff' | 'resident';

export interface User {
  username: string;
  role: UserRole;
}

// Each login is tracked here
export interface LoginRecord {
  username: string;
  role: UserRole;
  loginTime: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Store all login events
  private loginHistory: LoginRecord[] = [];

  // User logs in
  login(user: User) {
    this.currentUserSubject.next(user);

    // Track login event
    this.loginHistory.push({
      username: user.username,
      role: user.role,
      loginTime: new Date()
    });

    console.log(`User logged in: ${user.username} (${user.role})`);
  }

  // User logs out
  logout() {
    this.currentUserSubject.next(null);
  }

  // Get currently logged-in user
  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  // Get full login history
  getLoginHistory(): LoginRecord[] {
    return this.loginHistory;
  }

  // Count how many users logged in today
  getTodaysLogins(): number {
    const today = new Date();
    return this.loginHistory.filter(record => {
      const login = record.loginTime;
      return login.getFullYear() === today.getFullYear() &&
             login.getMonth() === today.getMonth() &&
             login.getDate() === today.getDate();
    }).length;
  }
}