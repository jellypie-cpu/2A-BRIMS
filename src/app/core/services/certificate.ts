import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private key = 'certificates';

  getAll(): any[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  saveAll(data: any[]): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  add(cert: any): void {
    const data = this.getAll();
    data.push(cert);
    this.saveAll(data);
  }

  createDefaultCertificates(residentId: string, residentName: string): void {
    const certificates = this.getAll();

    const newCerts = [
      {
        id: 'CERT-' + Date.now() + '-C',
        residentId,
        residentName,
        type: 'Barangay Clearance',
        status: 'Pending',
        dateCreated: new Date().toISOString()
      },
      {
        id: 'CERT-' + Date.now() + '-R',
        residentId,
        residentName,
        type: 'Barangay Residency',
        status: 'Pending',
        dateCreated: new Date().toISOString()
      }
    ];

    this.saveAll([...certificates, ...newCerts]);
  }
}