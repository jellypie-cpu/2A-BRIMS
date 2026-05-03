import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private key = 'requests';

  getAll() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  saveAll(data: any[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  create(residentId: string, type: string) {
    const data = this.getAll();

    data.push({
      id: 'REQ-' + Date.now(),
      residentId,
      type,
      status: 'pending',
      createdAt: new Date()
    });

    this.saveAll(data);
  }

  getPending() {
    return this.getAll().filter((r: any) => r.status === 'pending');
  }

  updateStatus(id: string, status: string) {
    const data = this.getAll();

    const index = data.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      data[index].status = status;
      this.saveAll(data);
    }
  }
}