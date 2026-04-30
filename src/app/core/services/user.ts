import { Injectable } from '@angular/core';
import { AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: AppUser[] = [];

  constructor() {
    this.loadFromStorage();

    // Auto create default users if empty
    if (this.users.length === 0) {
      this.seedDefaultUsers();
    }
  }

  // ======================
  // GET ALL USERS
  // ======================
  getUsers(): AppUser[] {
    return this.users;
  }

  // ======================
  // FIND USER BY EMAIL
  // ======================
  findByEmail(email: string): AppUser | undefined {
    return this.users.find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  // ======================
  // ADD USER
  // ======================
  addUser(user: AppUser) {
    user.id = 'USR-' + Date.now();
    user.createdAt = new Date();

    this.users.push(user);
    this.saveToStorage();
  }

  // ======================
  // UPDATE USER
  // ======================
  updateUser(id: string, updatedData: Partial<AppUser>) {
    const index = this.users.findIndex(user => user.id === id);

    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...updatedData
      };

      this.saveToStorage();
    }
  }

  // ======================
  // DELETE USER
  // ======================
  deleteUser(id: string) {
    this.users = this.users.filter(user => user.id !== id);
    this.saveToStorage();
  }

  // ======================
  // DEFAULT USERS
  // ======================
  private seedDefaultUsers() {
    const defaultUsers: AppUser[] = [
      {
        username: 'Jelly Quen',
        email: 'maniscan@brims.com',
        password: '1234',
        role: 'admin'
      },
      {
        username: 'Staff Member',
        email: 'staff@brims.com',
        password: '1234',
        role: 'staff'
      },
      {
        username: 'Resident',
        email: 'resident@brims.com',
        password: '1234',
        role: 'resident'
      },
      {
        username: 'Elbert Lood',
        email: 'luod@brims.com',
        password: '1234',
        role: 'resident'
      }
    ];

    defaultUsers.forEach(user => this.addUser(user));
  }

  // ======================
  // LOCAL STORAGE
  // ======================
  private saveToStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  private loadFromStorage() {
    const data = localStorage.getItem('users');
    this.users = data ? JSON.parse(data) : [];
  }
}