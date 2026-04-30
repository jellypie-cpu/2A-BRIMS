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

  // ADD RESIDENT
  add(resident: any): void {
    const data = this.getAll();
    data.push(resident);
    this.saveAll(data);
  }

  // DELETE RESIDENT
  delete(id: string): void {
    const data = this.getAll().filter((r: any) => r.id !== id);
    this.saveAll(data);
  }
}