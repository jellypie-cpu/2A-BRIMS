import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: any[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // ======================
  // GET ALL USERS
  // ======================
  getUsers() {
    return this.users;
  }

  // ======================
  // ADD USER
  // ======================
  addUser(user: any) {
    user.id = 'USR-' + Date.now();
    this.users.push(user);
    this.saveToStorage();
  }

  // ======================
  // UPDATE USER
  // ======================
  updateUser(id: string, updatedData: any) {
    const index = this.users.findIndex(u => u.id === id);

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
    this.users = this.users.filter(u => u.id !== id);
    this.saveToStorage();
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