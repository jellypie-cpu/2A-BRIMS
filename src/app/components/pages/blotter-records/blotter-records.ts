import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { BlotterService } from '../../../core/services/blotter';
import { BlotterForm } from './blotter-form/blotter-form';

@Component({
  selector: 'app-blotter-records',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, BlotterForm],
  templateUrl: './blotter-records.html',
  styleUrls: ['./blotter-records.scss']
})
export class BlotterRecords implements OnInit {

  blotterCases: any[] = [];
  filteredCases: any[] = [];

  selectedStatus: string = '';
  searchText: string = '';

  showForm = false;

  constructor(private blotterService: BlotterService) {}

  ngOnInit() {
    this.blotterService.getAll().subscribe((data: any[]) => {
      const safe = data || [];

      this.blotterCases = safe;
      this.filteredCases = [...this.blotterCases];
    });
  }

  filterCases() {
    this.filteredCases = this.blotterCases.filter(b => {

      const statusMatch = this.selectedStatus
        ? b.status === this.selectedStatus
        : true;

      const nameMatch = this.searchText
        ? (b.residentName || '')
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        : true;

      return statusMatch && nameMatch;
    });
  }

  addCase() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  async saveCase(data: any) {

    const blotter = {
      id: 'BLT-' + Date.now(),

      complaint: data.complaint,
      victims: data.victims,
      respondent: data.respondent,

      type: data.type,
      location: data.location,
      date: data.date,
      time: data.time,

      status: data.status,
      description: data.description,

      residentName: data.victims,

      barangay: 'San Martin',
      issuedAt: new Date().toISOString()
    };

    await this.blotterService.add(blotter);

    this.closeForm();

    alert('Blotter case saved successfully!');
  }

  async viewCase(blotter: any) {

    const newStatus = prompt(
      `Update status (Active / Settled / Scheduled)`,
      blotter.status
    );

    if (!newStatus) return;

    if (!['Active', 'Settled', 'Scheduled'].includes(newStatus)) {
      alert('Invalid status');
      return;
    }

    await this.blotterService.update(blotter.id, {
      status: newStatus
    });

    alert('Status updated!');
  }

  async deleteCase(blotter: any) {
    if (confirm('Delete this case?')) {
      await this.blotterService.delete(blotter.id);
    }
  }

  getCount(status: string) {
    return this.blotterCases.filter(b => b.status === status).length;
  }
}