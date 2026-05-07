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

  //datas for residents list and filtering
  residents: any[] = [];
  filteredResidents: any[] = [];

  zones: string[] = [];
  selectedZone: string = '';
  searchText: string = '';

  //for the clearance form modal
  selectedResident: any = null;
  showModal: boolean = false;

  constructor(
    private residentService: ResidentService,
    private certificateService: CertificateService
  ) {}

  //init method to load residents and setup zones
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

  //filter residents based on zone and search text
  filterResidents() {

    const zone = this.selectedZone;

    this.filteredResidents = this.residents.filter(resident => {

      const zoneText = 'Zone ' + resident.address?.zone;

      const matchesZone = zone
        ? zoneText === zone
        : true;

      const matchesName = this.searchText
        ? (resident.fullname || '')
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        : true;

      return matchesZone && matchesName;
    });
  }

  // open clearance form
  openClearance(resident: any) {
    this.selectedResident = resident;
    this.showModal = true;
  }

  //close form
  closePrint() {
    this.selectedResident = null;
    this.showModal = false;
  }
//generate clearance
  async generateClearance(resident: any) {

    const certificate = {
      residentId: resident.id,
      residentName: resident.fullname,
      type: 'Barangay Clearance',
      status: 'Pending',
      date: new Date().toISOString()
    };

    await this.certificateService.add(certificate);

    this.openClearance(resident);

    alert(`Clearance generated for ${resident.fullname}`);
  }
}