import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaranggayIndigencyForm } from './baranggay-indigency-form/baranggay-indigency-form';
import { ResidentService } from '../../../../core/services/resident';
import { CertificateService } from '../../../../core/services/certificate';
import { AuthService } from '../../../../core/services/auth';
import { serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-baranggay-indigency',
  standalone: true,
  imports: [CommonModule, FormsModule, BaranggayIndigencyForm],
  templateUrl: './baranggay-indigency.html',
  styleUrls: ['./baranggay-indigency.scss']
})
export class BaranggayIndigency implements OnInit {

  residents: any[] = [];
  filteredResidents: any[] = [];

  zones: string[] = [];
  selectedZone: string = '';
  searchText: string = '';

  selectedResident: any = null;
  showModal: boolean = false;

  constructor(
    private residentService: ResidentService,
    private certificateService: CertificateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.residentService.getAll().subscribe(residents => {

      const safe = residents || [];

      this.residents = safe.filter(r => !r['isArchived']);
      this.filteredResidents = [...this.residents];

      this.zones = [...new Set(
        this.residents.map(r => r.address?.zone).filter(Boolean)
      )].map(z => 'Zone ' + z);
    });
  }

  filterResidents() {
    this.filteredResidents = this.residents.filter(r => {

      const zoneMatch = this.selectedZone
        ? ('Zone ' + r.address?.zone) === this.selectedZone
        : true;

      const nameMatch = this.searchText
        ? r.fullname?.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      return zoneMatch && nameMatch;
    });
  }

  openIndigency(resident: any) {
    this.selectedResident = resident;
    this.showModal = true;
  }

  closeModal() {
    this.selectedResident = null;
    this.showModal = false;
  }

  // 🔥 FIREBASE CERTIFICATE CREATION
  async generateIndigency(resident: any) {

    const user = this.authService.getCurrentUser();

    const certificate = {
      residentId: resident.id,
      residentName: resident.fullname,
      type: 'Barangay Indigency',
      status: 'Issued',
      zone: resident.address?.zone,
      issuedBy: user?.id || null,
      createdAt: serverTimestamp()
    };

    await this.certificateService.add(certificate);

    this.openIndigency(resident);

    alert(`Indigency issued for ${resident.fullname}`);
  }
}