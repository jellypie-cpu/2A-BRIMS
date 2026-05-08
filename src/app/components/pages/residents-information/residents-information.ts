import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentForm } from './residents-form/residents-form';
import { ResidentService } from '../../../core/services/resident';
import { FirebaseStorageService } from '../../../core/services/firebase-storage';

@Component({
  selector: 'app-residents-information',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentForm],
  templateUrl: './residents-information.html',
  styleUrls: ['./residents-information.scss'],
})
export class ResidentsInformation implements OnInit {

  constructor(
  private residentService: ResidentService,
  private storageService: FirebaseStorageService
) {}

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
  

  ngOnInit() {
  this.residentService.getAll().subscribe((residents: any[]) => {

    const safeResidents = residents || [];

    this.allResidents = safeResidents.filter((r: any) => !r.isArchived);

    this.filterResidents();
  });
}

//filtering the residents list based on zone and search text
filterResidents() {

  let filtered = [...this.allResidents];

  if (this.selectedZone !== null) {
    filtered = filtered.filter((r: any) =>
      r.address?.zone === this.selectedZone
    );
  }

  if (this.searchText.trim()) {
    const lower = this.searchText.toLowerCase();

    filtered = filtered.filter((r: any) =>
      r.fullname?.toLowerCase().includes(lower)
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

  this.showForm = false;

  setTimeout(() => {

    this.selectedResident = null;
    this.isEditMode = true;

    this.showForm = true;

  });
}

 //view resident

  openResident(resident: any) {

  this.showForm = false;

  setTimeout(() => {

    this.selectedResident = {
      ...resident
    };

    this.isEditMode = false;

    this.showForm = true;

  });
}

  //close form

  closeForm() {
    this.showForm = false;
  }
 
  // SAVE (ADD + UPDATE)
  
  async saveResident(resident: any) {

  const isDuplicate = this.allResidents.some(r =>
    r.id !== resident.id &&
    r.fullname?.trim().toLowerCase() === resident.fullname?.trim().toLowerCase() &&
    r.birthdate === resident.birthdate
  );

  if (isDuplicate) {
    alert('This resident already exists.');
    return;
  }

  let docRef: any;

  // ADD
  if (!resident.id) {

    docRef = await this.residentService.add(resident);

    resident.id = docRef.id;

  } else {

    await this.residentService.update(resident.id, resident);
  }

  // PHOTO UPLOAD
  if (resident.selectedFile) {

    const photoURL =
      await this.storageService.uploadResidentPhoto(
        resident.selectedFile,
        resident.id
      );

    await this.residentService.update(resident.id, {
      photo: photoURL
    });
  }

  this.closeForm();
}

  //archive resident
 async archiveResident(resident: any) {
  if (confirm(`Archive ${resident.fullname}?`)) {

    await this.residentService.update(resident.id, {
      isArchived: true
    });
  }
}
  }
