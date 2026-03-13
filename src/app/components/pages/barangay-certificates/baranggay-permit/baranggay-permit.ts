import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface Business {
  businessName: string;
  ownerName: string;
  zone: string;
  permitNumber: string;
}

@Component({
  selector: 'app-baranggay-permit',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './baranggay-permit.html',
  styleUrls: ['./baranggay-permit.scss']
})
export class BaranggayPermit {

  // Example List of registered businesses
  businesses: Business[] = [
    { businessName: 'Juan Trading', ownerName: 'Juan Dela Cruz', zone: 'Zone 1', permitNumber: 'BP-001' },
    { businessName: 'Maria Sweets', ownerName: 'Maria Santos', zone: 'Zone 1', permitNumber: 'BP-002' },
    { businessName: 'Pedro Repair Shop', ownerName: 'Pedro Reyes', zone: 'Zone 2', permitNumber: 'BP-003' }
  ];

  zones: string[] = ['Zone 1', 'Zone 2', 'Zone 3'];
  selectedZone: string = '';
  searchText: string = '';

  filteredBusinesses: Business[] = [];

  constructor() {
    this.filteredBusinesses = this.businesses;
  }

  filterBusinesses() {
    this.filteredBusinesses = this.businesses.filter(biz => {
      const matchesZone = this.selectedZone ? biz.zone === this.selectedZone : true;
      const matchesName = this.searchText
        ? (biz.businessName + ' ' + biz.ownerName)
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        : true;
      return matchesZone && matchesName;
    });
  }

  printPermit(business: Business) {
    console.log(`Printing permit for: ${business.businessName}, Owner: ${business.ownerName}`);
  
  }
}