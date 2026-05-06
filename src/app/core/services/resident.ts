import { Injectable } from '@angular/core';
import { UserService } from './user';
import { AppUser } from '../models/user.model';

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

  // CREATE USER 
 const newUser: AppUser = {
  username: resident.fullname,
  email: resident.fullname.toLowerCase().replace(/\s/g, '') + '@brgyvillanueva.com',
  password: '1234',
  role: 'resident',
  residentId: resident.id
};

  this.userService.addUser(newUser);

  //  LINK BACK USER ID TO RESIDENT
  const users = this.userService.getUsers();
  const createdUser = users[users.length - 1];

  resident.userId = createdUser.id;
  this.saveAll(data);
}


  // DELETE RESIDENT
  delete(id: string): void {
    const data = this.getAll().filter((r: any) => r.id !== id);
    this.saveAll(data);
  }
}