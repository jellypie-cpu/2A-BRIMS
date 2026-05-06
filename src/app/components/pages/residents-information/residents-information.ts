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

  //data for the residents list

  zones = [1,2,3,4,5,6,7,8,9,10,11,12];
  selectedZone: number | null = null;

  allResidents: any[] = [];
  residents: any[] = [];
  searchText = '';

 //form for the resident details

  showForm = false;
  selectedResident: any = null;
  isEditMode: boolean = false;

  constructor(private residentService: ResidentService) {}
  
 loadResidents() {
   const all = this.residentService.getAll();
  this.residents = all.filter(r => !r.isArchived);
}

  ngOnInit() {
  this.allResidents = this.residentService.getAll().filter(r => !r.isArchived);
  this.filterResidents();
}

//filtering the residents list based on zone and search text
filterResidents() {

  let filtered = this.residentService.getAll().filter(r => !r.isArchived);
  
  // ONLY FILTER IF NOT NULL
  if (this.selectedZone !== null) {
    filtered = filtered.filter(
      r => Number(r.address?.zone) === this.selectedZone
    );
  }

  if (this.searchText.trim()) {
    const lower = this.searchText.toLowerCase();
    filtered = filtered.filter(r =>
      r.fullname.toLowerCase().includes(lower)
    );
  }

  this.residents = filtered;
}
onSearchChange() {
  this.filterResidents()
}
//chck duplicate
 checkDuplicateLive(resident: any): boolean {
    return this.allResidents.some(r =>
      r.id !== resident.id &&
      r.fullname?.trim().toLowerCase() === resident.fullname?.trim().toLowerCase() &&
      r.birthdate === resident.birthdate
    );
  }   

 //add resident

  addResident() {
    this.selectedResident = null;
    this.isEditMode = true; // ADD MODE
    this.showForm = true;
  }

 //view resident

  openResident(resident: any) {
    this.selectedResident = structuredClone(resident);
    this.isEditMode = false; // VIEW MODE FIRST
    this.showForm = true;
  }

  //close form

  closeForm() {
    this.showForm = false;
  }
 
  // SAVE (ADD + UPDATE)
  
  saveResident(resident: any) {
  const all = this.residentService.getAll();

  const isDuplicate = all.some(r =>
    r.id !== resident.id && // ignore self when updating
    r.fullname.trim().toLowerCase() === resident.fullname.trim().toLowerCase() &&
    r.birthdate === resident.birthdate &&
    r.address?.zone === resident.address?.zone &&
    r.address?.street?.toLowerCase() === resident.address?.street?.toLowerCase()
  );

  if (isDuplicate) {
    alert('This resident already exists in the system.');
    return;
  }

  const index = all.findIndex(r => r.id === resident.id);

  if (index !== -1) {
    all[index] = resident;
  } else {
    resident.id = 'RES-' + crypto.randomUUID();
    all.push(resident);
  }

  this.residentService.saveAll(all);

  this.allResidents = all;
  this.filterResidents();
  this.closeForm();
}
  //archive resident
  archiveResident(resident: any) {
  if (confirm('Archive ' + resident.fullname + '?')) {

    const all = this.residentService.getAll();

    const index = all.findIndex(r => r.id === resident.id);

    if (index !== -1) {
      all[index].isArchived = true; // 👈 soft delete
    }

    this.residentService.saveAll(all);

    this.allResidents = all;
    this.filterResidents();
  }
}
  }
