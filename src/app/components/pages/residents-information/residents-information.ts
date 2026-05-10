import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { ResidentForm } from './residents-form/residents-form';
import { ResidentService } from '../../../core/services/resident';
import { AuthService } from '../../../core/services/auth';
import { Resident } from '../../../core/models/resident.model';

@Component({
  selector: 'app-residents-information',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentForm],
  templateUrl: './residents-information.html',
  styleUrls: ['./residents-information.scss'],
})
export class ResidentsInformation implements OnInit {
  zones = ['1','2','3','4','5','6','7','8','9','10','11','12'];

  selectedZone: string | null = null;

  allResidents: Resident[] = [];
  residents: Resident[] = [];

  searchText = '';
  loading = true;

  showForm = false;
  selectedResident: Resident | null = null;
  isEditMode = false;

  constructor(
    private residentService: ResidentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadResidents();
  }

  loadResidents() {
    this.loading = true;

    this.residentService.getAll().subscribe({
      next: (residents: Resident[]) => {
        this.allResidents = (residents || []).filter(r => r.isArchived !== true);
        this.filterResidents();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Unable to load residents from Firestore.', 'error');
      }
    });
  }

  filterResidents() {
    let filtered = [...this.allResidents];

    if (this.selectedZone !== null) {
      filtered = filtered.filter(r => r.address?.zone === this.selectedZone);
    }

    if (this.searchText.trim()) {
      const lower = this.searchText.toLowerCase();

      filtered = filtered.filter(r =>
        r.fullname?.toLowerCase().includes(lower) ||
        r.address?.street?.toLowerCase().includes(lower) ||
        r.address?.barangay?.toLowerCase().includes(lower)
      );
    }

    this.residents = filtered;
  }

  addResident() {
    this.selectedResident = null;
    this.isEditMode = true;
    this.showForm = true;
  }

  openResident(resident: Resident) {
    this.selectedResident = structuredClone(resident);
    this.isEditMode = false;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.selectedResident = null;
  }

  async saveResident(resident: Resident) {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?.id || !currentUser?.username || !currentUser?.email || !currentUser?.role) {
      Swal.fire(
        'Incomplete User Credentials',
        'Your account credentials are incomplete. Please complete your username, email, and role before saving residents.',
        'warning'
      );
      return;
    }

    const isDuplicate = this.allResidents.some(r =>
      r.id !== resident.id &&
      r.fullname?.trim().toLowerCase() === resident.fullname?.trim().toLowerCase() &&
      r.birthdate === resident.birthdate
    );

    if (isDuplicate) {
      Swal.fire(
        'Duplicate Resident',
        'A resident with the same full name and birthdate already exists.',
        'warning'
      );
      return;
    }

    const payload: Resident = {
      ...resident,
      createdBy: resident.createdBy || currentUser.id,
      createdByName: resident.createdByName || currentUser.username,
      updatedBy: currentUser.id,
      isArchived: resident.isArchived ?? false,
      address: {
        zone: String(resident.address.zone),
        street: resident.address.street,
        barangay: resident.address.barangay
      }
    };

    try {
      if (!payload.id) {
        await this.residentService.add(payload);
        Swal.fire('Saved', 'Resident added successfully.', 'success');
      } else {
        await this.residentService.update(payload.id, payload);
        Swal.fire('Updated', 'Resident updated successfully.', 'success');
      }

      this.closeForm();
    } catch {
      Swal.fire('Error', 'Failed to save resident.', 'error');
    }
  }

  async archiveResident(resident: Resident) {
    const confirm = await Swal.fire({
      title: 'Archive Resident?',
      text: `Move ${resident.fullname} to archive?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, archive',
      cancelButtonText: 'Cancel'
    });

    if (!confirm.isConfirmed || !resident.id) return;

    await this.residentService.archive(resident.id);
    Swal.fire('Archived', 'Resident moved to archive.', 'success');
  }
}