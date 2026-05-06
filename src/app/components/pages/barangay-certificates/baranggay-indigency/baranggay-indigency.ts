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

  // ======================
  // DATA
  // ======================
  residents: any[] = [];
  filteredResidents: any[] = [];

  zones: string[] = [];
  selectedZone: string = '';
  searchText: string = '';

  // ======================
  // MODAL
  // ======================
  selectedResident: any = null;
  showModal: boolean = false;

  constructor(
    private residentService: ResidentService,
    private certificateService: CertificateService
  ) {}

  // ======================
  // INIT
  // ======================
  ngOnInit() {
    this.residents = this.residentService.getAll().filter(r => !r.isArchived);
    this.filterResidents();

    // auto-create zones from residents
    this.zones = [...new Set(
      this.residents
        .map(r => r.address?.zone)
        .filter(z => z)
        .map(z => 'Zone ' + z)
    )];
  }

  // ======================
  // FILTER
  // ======================
  filterResidents() {
    this.filteredResidents = this.residents.filter(resident => {

      const zoneText = 'Zone ' + resident.address?.zone;

      const matchesZone = this.selectedZone
        ? zoneText === this.selectedZone
        : true;

      const matchesName = this.searchText
        ? resident.fullname
            ?.toLowerCase()
            .includes(this.searchText.toLowerCase())
        : true;

      return matchesZone && matchesName;
    });
  }

  // ======================
  // OPEN MODAL
  // ======================
  openIndigency(resident: any) {
    this.selectedResident = resident;
    this.showModal = true;
  }

  // ======================
  // CLOSE MODAL
  // ======================
  closeModal() {
    this.showModal = false;
    this.selectedResident = null;
  }

  // ======================
  // GENERATE CERTIFICATE
  // ======================
  generateIndigency(resident: any) {

    const certificate = {
      id: 'CERT-' + Date.now(),
      residentId: resident.id,
      residentName: resident.fullname,
      type: 'Barangay Indigency',
      status: 'Issued',
      date: new Date().toISOString()
    };

    this.certificateService.add(certificate);

    alert('Barangay Indigency issued to ' + resident.fullname);
  }
}