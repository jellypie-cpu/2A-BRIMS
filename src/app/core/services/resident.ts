import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  private key = 'residents';

  // GET ALL RESIDENTS
  getAll(): any[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  // SAVE ALL RESIDENTS
  saveAll(data: any[]): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  // ADD RESIDENT + CREATE USER
  add(resident: any): void {
    const data = this.getAll();

    // create resident id
    resident.id = 'RES-' + Date.now();
    

    data.push(resident);
    this.saveAll(data);

    // create linked user
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const newUser = {
      id: 'USR-' + Date.now(),
      username: resident.fullname,
      email: resident.fullname.toLowerCase().replace(/\s/g, '') + '@brgyvillanueva.com',
      password: '1234',
      role: 'resident',
      residentId: resident.id
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
  }

  // DELETE RESIDENT
  delete(id: string): void {
    const data = this.getAll().filter((r: any) => r.id !== id);
    this.saveAll(data);
  }
}