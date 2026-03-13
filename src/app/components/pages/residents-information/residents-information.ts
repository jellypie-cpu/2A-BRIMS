import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-residents-information',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './residents-information.html',
  styleUrls: ['./residents-information.scss'],
})
export class ResidentsInformation {

  zones = [1,2,3,4,5,6,7,8,9,10,11,12];
  selectedZone = 1;

  allResidents = [
    { id: 'RES-001', fullname: 'Juan Dela Cruz', birthdate: '1990-05-12', civilStatus: 'Single', address: 'Zone 1', zone: 1 },
    { id: 'RES-002', fullname: 'Maria Santos', birthdate: '1995-08-22', civilStatus: 'Married', address: 'Zone 2', zone: 2 },
    { id: 'RES-003', fullname: 'Pedro Reyes', birthdate: '1985-01-10', civilStatus: 'Married', address: 'Zone 1', zone: 1 }
  ];

  residents: any[] = [];

  searchText = ''; // NEW: search input

  constructor() {
    this.filterResidents();
  }

  filterResidents() {
    // Filter by selected zone
    let filtered = this.allResidents.filter(r => r.zone === this.selectedZone);

    // If search text is not empty, further filter by fullname
    if (this.searchText.trim() !== '') {
      const lower = this.searchText.toLowerCase();
      filtered = filtered.filter(r => r.fullname.toLowerCase().includes(lower));
    }

    this.residents = filtered;
  }

  onSearchChange() {
    this.filterResidents(); // called whenever search text changes
  }

  openResident(resident: any) {
    alert('View / Update ' + resident.fullname);
  }

  deleteResident(resident: any) {
    const confirmDelete = confirm('Delete ' + resident.fullname + '?');
    if (confirmDelete) {
      this.allResidents = this.allResidents.filter(r => r !== resident);
      this.filterResidents();
    }
  }

  addResident() {
    const newId = 'RES-' + (this.allResidents.length + 1).toString().padStart(3, '0');
    const newResident = {
      id: newId,
      fullname: 'New Resident ' + newId,
      birthdate: '2000-01-01',
      civilStatus: 'Single',
      address: 'Zone ' + this.selectedZone,
      zone: this.selectedZone
    };
    this.allResidents.push(newResident);
    this.filterResidents();
  }

}