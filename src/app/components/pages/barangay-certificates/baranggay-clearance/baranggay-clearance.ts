  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { BaranggayClearanceForm } from './baranggay-clearance-form/baranggay-clearance-form';
  import { ResidentService } from '../../../../core/services/resident';
  import { CertificateService } from '../../../../core/services/certificate';
  import { AuthService } from '../../../../core/services/auth';
  import { serverTimestamp } from 'firebase/firestore';

  @Component({
    selector: 'app-baranggay-clearance',
    standalone: true,
    imports: [CommonModule, FormsModule, BaranggayClearanceForm],
    templateUrl: './baranggay-clearance.html',
    styleUrls: ['./baranggay-clearance.scss']
  })
  export class BaranggayClearance implements OnInit {

    residents: any[] = [];
    filteredResidents: any[] = [];

    zones: string[] = [];
  selectedZone: string | null = null;
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

        // only active residents (not archived)
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

        const searchMatch = this.searchText
          ? r.fullname?.toLowerCase().includes(this.searchText.toLowerCase())
          : true;

        return zoneMatch && searchMatch;
      });
    }

    openClearance(resident: any) {
      this.selectedResident = resident;
      this.showModal = true;
    }

    closePrint() {
      this.selectedResident = null;
      this.showModal = false;
    }

    // 🔥 MAIN FIREBASE SAVE LOGIC
    async generateClearance(resident: any) {

      const currentUser = this.authService.getCurrentUser();

      const certificate = {
        residentId: resident.id,
        residentName: resident.fullname,
        type: 'Barangay Clearance',
        status: 'Pending',
        zone: resident.address?.zone,
        issuedBy: currentUser?.id || null,
        createdAt: serverTimestamp()
      };

      await this.certificateService.add(certificate);

      this.openClearance(resident);

      alert(`Barangay Clearance created for ${resident.fullname}`);
    }
  }