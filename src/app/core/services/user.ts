import { Injectable } from '@angular/core';
import { AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: AppUser[] = [];

  constructor() {
    this.loadFromStorage();

     const stored = localStorage.getItem('users');

    // Auto create default users if empty
     if (!stored || JSON.parse(stored).length === 0) {
       this.users = [];
      this.seedDefaultUsers();
      this.saveToStorage();
    }
  }

  //get all users
  getUsers(): AppUser[] {
    this.loadFromStorage(); // Ensure we have the latest data from storage
    return this.users;
  }
//find users
  findByEmail(email: string): AppUser | undefined {
  this.loadFromStorage();

  const cleanEmail = email?.trim().toLowerCase();//trim to remove spaces and also to lower case for case-insensitive comparison

  return this.users.find((user) => {
    const userEmail = user.email?.trim().toLowerCase();
    return userEmail === cleanEmail;
  });
  }

  //add users
  addUser(user: AppUser) {
    this.loadFromStorage();
    user.id = 'USR-' + Date.now() + '-' + Math.random().toString(36).substring(2);// generate unique id
    user.createdAt = new Date();

    this.users.push(user);
    this.saveToStorage();
  }

  //update users
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

 //delete users
  deleteUser(id: string) {
    this.users = this.users.filter(user => user.id !== id);
    this.saveToStorage();
  }

  //users
  private seedDefaultUsers() {
    const defaultUsers: AppUser[] = [
      {
        username: 'Jelly Quen Maniscan',
        email: 'maniscan@brims.com',
        password: '1234',
        role: 'admin',
        createdAt: new Date()
      },
      {
        username: 'Elbert C.Lood',
        email: 'lood@brims.com',
        password: '1234',
        role: 'staff',
        createdAt: new Date()
      },
      {
        username: 'Nina P. Daasin',
        email: 'daasin@brims.com',
        password: '1234',
        role: 'staff',
        createdAt: new Date()
      },
      {
        username: 'Angelica Ricaforte',
        email: 'ricaforte@brims.com',
        password: '1234',
        role: 'staff',
        createdAt: new Date()
      },
      {
        username: 'Jillane Kate S.Ejem',
        email: 'ejem@brims.com',
        password: '1234',
        role: 'resident',
        createdAt: new Date()
      },
      {
        username: 'HazelJoy Unabia',
        email: 'unabia@brims.com',
        password: '1234',
        role: 'resident',
        createdAt: new Date()
      },
      {
        username: 'Angel Piollo',
        email: 'piollo@brims.com',
        password: '1234',
        role: 'resident',
        createdAt: new Date()
      },
      {
        username: 'Juliet Ondag',
        email: 'ondag@brims.com',
        password: '1234',
        role: 'resident',
        createdAt: new Date()
      }
    ];

    defaultUsers.forEach(user => this.addUser(user));
  }

  //save to local storage
  private saveToStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }
  
  private loadFromStorage() {
  const data = localStorage.getItem('users');

  if (!data) {
    this.users = [];
    return;
  }

  try {
    this.users = JSON.parse(data);
  } catch (e) {
    console.error('Error parsing users from storage', e);
    this.users = [];
  }
}
}