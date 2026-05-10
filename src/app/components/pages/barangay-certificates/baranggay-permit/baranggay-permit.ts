import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ResidentService } from '../../../../core/services/resident';
import { CertificateService } from '../../../../core/services/certificate';
import { BaranggayPermitForm } from './baranggay-permit-form/baranggay-permit-form';
import { AuthService } from '../../../../core/services/auth';
import { serverTimestamp } from 'firebase/firestore';

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

 selectedZone: string | null = null;
  searchText: string = '';

  selectedResident: any = null;
  showModal: boolean = false;

  constructor(
    private authService: AuthService,
    private residentService: ResidentService,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.residentService.getAll().subscribe((residents: any[]) => {

      const safe = residents || [];

      this.residents = safe.filter(r => !r['isArchived']);
      this.filteredResidents = [...this.residents];
    });
  }

  filterResidents() {
    this.filteredResidents = this.residents.filter(r => {

      const zoneMatch = this.selectedZone
        ? 'Zone ' + r.address?.zone === this.selectedZone
        : true;

      const nameMatch = this.searchText
        ? (r.fullname || '').toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      return zoneMatch && nameMatch;
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

  async savePermit(data: any) {

  if (!data?.resident) {
    alert('No resident selected');
    return;
  }

  if (!data.businessName || !data.businessType || !data.address) {
    alert('Please complete all business details.');
    return;
  }

  const currentUser = this.authService.getCurrentUser();

  const permit = {
    residentId: data.resident.id,
    residentName: data.resident.fullname,

    businessName: data.businessName,
    businessType: data.businessType,
    businessAddress: data.address,

    type: 'Barangay Business Permit',
    status: 'issued',

    issuedBy: currentUser?.id || null,

   createdAt: serverTimestamp()
  };

  await this.certificateService.add(permit);

  this.closeModal();

  alert(`Permit successfully issued to ${data.resident.fullname}`);
}
}