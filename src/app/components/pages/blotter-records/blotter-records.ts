import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

interface BlotterCase {
  id: number;
  residentName: string;
  complaint: string;
  status: 'Active' | 'Settled' | 'Scheduled';
  date: string;
}

@Component({
  selector: 'app-blotter-records',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule],
  templateUrl: './blotter-records.html',
  styleUrls: ['./blotter-records.scss']
})
export class BlotterRecords implements OnInit {

  blotterCases: BlotterCase[] = [
    { id: 1, residentName: 'Juan Dela Cruz', complaint: 'Noise Complaint', status: 'Active', date: '2026-03-13' },
    { id: 2, residentName: 'Maria Santos', complaint: 'Property Dispute', status: 'Settled', date: '2026-03-12' },
    { id: 3, residentName: 'Pedro Reyes', complaint: 'Vandalism', status: 'Scheduled', date: '2026-03-14' },
  ];

  filteredCases: BlotterCase[] = [];
  selectedStatus: string = '';
  searchText: string = '';

  constructor() { }

  ngOnInit() {
    this.filteredCases = this.blotterCases;
  }

  filterCases() {
    this.filteredCases = this.blotterCases.filter(b => {
      const matchesStatus = this.selectedStatus ? b.status === this.selectedStatus : true;
      const matchesName = this.searchText
        ? b.residentName.toLowerCase().includes(this.searchText.toLowerCase())
        : true;
      return matchesStatus && matchesName;
    });
  }

  addCase() {
    // logic to open a modal or navigate to add case page
    console.log('Add new blotter case');
  }

  viewCase(blotter: BlotterCase) {
    // logic to view case details
    console.log('View case:', blotter);
  }

  deleteCase(blotter: BlotterCase) {
    this.blotterCases = this.blotterCases.filter(b => b.id !== blotter.id);
    this.filterCases(); // update filtered list
    console.log('Deleted case:', blotter);
  }

  getCount(status: 'Active' | 'Settled' | 'Scheduled') {
    return this.blotterCases.filter(b => b.status === status).length;
  }
}