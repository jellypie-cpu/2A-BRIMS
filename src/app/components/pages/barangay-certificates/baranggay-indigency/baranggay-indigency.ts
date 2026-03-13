import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface Resident {
  firstName: string;
  lastName: string;
  zone: string;
}

@Component({
  selector: 'app-baranggay-indigency',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './baranggay-indigency.html',
  styleUrls: ['./baranggay-indigency.scss']
})
export class BaranggayIndigency {

  residents: Resident[] = [
    { firstName: 'Juan', lastName: 'Dela Cruz', zone: 'Zone 1' },
    { firstName: 'Maria', lastName: 'Santos', zone: 'Zone 1' },
    { firstName: 'Pedro', lastName: 'Reyes', zone: 'Zone 2' },
    { firstName: 'Ana', lastName: 'Quezon', zone: 'Zone 2' },
    { firstName: 'Luis', lastName: 'Garcia', zone: 'Zone 3' }
  ];

  zones: string[] = ['Zone 1', 'Zone 2', 'Zone 3'];
  selectedZone: string = '';
  searchText: string = '';

  filteredResidents: Resident[] = [];

  constructor() {
    // initially show all residents
    this.filteredResidents = this.residents;
  }

  filterResidents() {
    this.filteredResidents = this.residents.filter(resident => {
      const matchesZone = this.selectedZone ? resident.zone === this.selectedZone : true;
      const matchesName = this.searchText
        ? (resident.firstName + ' ' + resident.lastName)
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        : true;

      return matchesZone && matchesName;
    });
  }

  generateIndigency(resident: Resident) {
    console.log('Generating indigency certificate for:', resident.firstName, resident.lastName);
  }
}