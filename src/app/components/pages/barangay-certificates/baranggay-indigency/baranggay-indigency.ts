import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { ResidentService } from '../../../../core/services/resident';
import { CertificateService } from '../../../../core/services/certificate';
import { BaranggayIndigencyForm } from './baranggay-indigency-form/baranggay-indigency-form';

@Component({
  selector: 'app-baranggay-indigency',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, BaranggayIndigencyForm],
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
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.residentService.getAll().subscribe((residents: any[]) => {

      const safe = residents || [];

      this.residents = safe.filter(r => !r.isArchived);
      this.filteredResidents = [...this.residents];

      this.zones = [...new Set(
        this.residents
          .map(r => r.address?.zone)
          .filter(Boolean)
          .map(z => 'Zone ' + z)
      )];
    });
  }

  filterResidents() {
    this.filteredResidents = this.residents.filter(resident => {

      const zoneText = 'Zone ' + resident.address?.zone;

      const matchesZone = this.selectedZone
        ? zoneText === this.selectedZone
        : true;

      const matchesName = this.searchText
        ? (resident.fullname || '')
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        : true;

      return matchesZone && matchesName;
    });
  }

  openIndigency(resident: any) {
    this.selectedResident = resident;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedResident = null;
  }

  async generateIndigency(resident: any) {

    const certificate = {
      residentId: resident.id,
      residentName: resident.fullname,
      type: 'Barangay Indigency',
      status: 'Issued',
      date: new Date().toISOString()
    };

    await this.certificateService.add(certificate);

    this.openIndigency(resident);

    alert(`Barangay Indigency issued to ${resident.fullname}`);
  }
}