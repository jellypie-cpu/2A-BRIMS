import { Injectable } from '@angular/core';
import { UserService } from './user';

@Injectable({
  providedIn: 'root'
  
})
export class ResidentService {

  private key = 'residents';
   constructor(private userService: UserService) {}

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

    resident = {
      ...resident,
      address: {
        zone: resident.zone,
        street: resident.street,
        barangay: resident.barangay
      }
    };

    data.push(resident);
    this.saveAll(data);

    this.userService.addUser({
      username: resident.fullname,
      email: resident.fullname.toLowerCase().replace(/\s/g, '') + '@brgyvillanueva.com',
      password: '1234',
      role: 'resident',
      residentId: resident.id
    });
  }


  // DELETE RESIDENT
  delete(id: string): void {
    const data = this.getAll().filter((r: any) => r.id !== id);
    this.saveAll(data);
  }
}