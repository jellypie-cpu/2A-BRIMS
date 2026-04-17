import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { ResidentService } from '../../../../core/services/resident';
import { CertificateService } from '../../../../core/services/certificate';
import { BaranggayClearanceForm } from './baranggay-clearance-form/baranggay-clearance-form';

@Component({
  selector: 'app-baranggay-clearance',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, BaranggayClearanceForm],
  templateUrl: './baranggay-clearance.html',
  styleUrls: ['./baranggay-clearance.scss']
})
export class BaranggayClearance implements OnInit {

  // ======================
  // DATA
  // ======================
  residents: any[] = [];
  filteredResidents: any[] = [];

  zones: string[] = [];
  selectedZone: string = '';
  searchText: string = '';

  // ======================
  // MODAL STATE
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
    this.residents = this.residentService.getAll();
    this.filteredResidents = this.residents;

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
        ? resident.fullname?.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      return matchesZone && matchesName;
    });
  }

  // ======================
  // OPEN MODAL
  // ======================
  openClearance(resident: any) {
    this.selectedResident = resident;
    this.showModal = true;
  }

  // ======================
  // CLOSE MODAL
  // ======================
  closePrint() {
    this.selectedResident = null;
    this.showModal = false;
  }

  // ======================
  // GENERATE CERTIFICATE (SAVE LOG)
  // ======================
  generateClearance(resident: any) {

    const certificate = {
      id: 'CERT-' + Date.now(),
      residentId: resident.id,
      residentName: resident.fullname,
      type: 'Barangay Clearance',
      status: 'Pending',
      date: new Date().toISOString()
    };

    this.certificateService.add(certificate);

    // optional: open printable modal
    this.openClearance(resident);

    alert('Barangay Clearance generated for ' + resident.fullname);
  }
}