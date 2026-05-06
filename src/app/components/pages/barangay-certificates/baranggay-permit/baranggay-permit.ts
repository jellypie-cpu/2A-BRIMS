import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { ResidentService } from '../../../../core/services/resident';
import { CertificateService } from '../../../../core/services/certificate';
import { BaranggayPermitForm } from './baranggay-permit-form/baranggay-permit-form';

@Component({
  selector: 'app-baranggay-permit',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, BaranggayPermitForm],
  templateUrl: './baranggay-permit.html',
  styleUrls: ['./baranggay-permit.scss']
})
export class BaranggayPermit implements OnInit {

  residents: any[] = [];
  filteredResidents: any[] = [];

  selectedZone: string = '';
  searchText: string = '';

  selectedResident: any = null;
  showModal: boolean = false;

  constructor(
    private residentService: ResidentService,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.residents = this.residentService.getAll().filter(r => !r.isArchived);
    this.filteredResidents = this.residents;
  }

  filterResidents() {
    this.filteredResidents = this.residents.filter(r => {

      const matchesZone = this.selectedZone
        ? 'Zone ' + r.address?.zone === this.selectedZone
        : true;

      const matchesName = this.searchText
        ? r.fullname?.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      return matchesZone && matchesName;
    });
  }

  openPermit(resident: any) {
    this.selectedResident = resident;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedResident = null;
  }

  savePermit(data: any) {

    const permit = {
      id: 'PERMIT-' + Date.now(),
      residentId: data.resident.id,
      residentName: data.resident.fullname,
      businessName: data.businessName,
      businessType: data.businessType,
      address: data.address,
      status: 'Approved',
      type: 'Barangay Business Permit',
      date: new Date().toISOString()
    };

    this.certificateService.add(permit);

    alert('Permit issued to ' + data.resident.fullname);
  }
}