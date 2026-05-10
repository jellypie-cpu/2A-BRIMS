import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentForm } from './residents-form/residents-form';
import { ResidentService } from '../../../core/services/resident';

@Component({
  selector: 'app-residents-information',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentForm],
  templateUrl: './residents-information.html',
  styleUrls: ['./residents-information.scss'],
})
export class ResidentsInformation implements OnInit {

  constructor(
    private residentService: ResidentService
  ) {}

  // CHANGED: zone should be string because Firebase stores strings
  zones = ['1','2','3','4','5','6','7','8','9','10','11','12'];

  // CHANGED
   selectedZone: string = '';

  allResidents: any[] = [];
  residents: any[] = [];
  searchText = '';

  showForm = false;
  selectedResident: any = null;
  isEditMode = false;

  ngOnInit() {
    this.residentService.getAll().subscribe((residents: any[]) => {
      const safeResidents = residents || [];

      this.allResidents = safeResidents.filter(
        (r: any) => !r['isArchived']
      );

      this.filterResidents();
    });
  }

  filterResidents() {
    let filtered = [...this.allResidents];

    if (this.selectedZone !== null) {
      filtered = filtered.filter(
        r => r.address?.zone === this.selectedZone
      );
    }

    if (this.searchText.trim()) {
      const lower = this.searchText.toLowerCase();

      filtered = filtered.filter(
        r => r.fullname?.toLowerCase().includes(lower)
      );
    }

    this.residents = filtered;
  }

  onSearchChange() {
    this.filterResidents();
  }

  addResident() {
    this.selectedResident = null;
    this.isEditMode = true;
    this.showForm = true;
  }

  openResident(resident: any) {
    this.selectedResident = { ...resident };
    this.isEditMode = false;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  async saveResident(resident: any) {

  // CHANGE: prevent duplicates properly
  const isDuplicate = this.allResidents.some(r =>
    r.id !== resident.id &&
    r.fullname?.toLowerCase() === resident.fullname?.toLowerCase() &&
    r.birthdate === resident.birthdate
  );

  if (isDuplicate) {
    alert('Duplicate resident detected');
    return;
  }

  // CHANGE: clean temp fields before Firestore save
  delete resident.selectedFile;
  delete resident.photoPreview;

  if (!resident.id) {
    await this.residentService.add(resident);
  } else {
    await this.residentService.update(resident.id, resident);
  }

  this.closeForm();
}

  async archiveResident(resident: any) {
    await this.residentService.update(resident.id, {
      isArchived: true
    });
  }
}