import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { BlotterService } from '../../../core/services/blotter';
import { BlotterForm } from './blotter-form/blotter-form';
import { Blotter } from '../../../core/models/blotter';

@Component({
  selector: 'app-blotter-records',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, BlotterForm],
  templateUrl: './blotter-records.html',
  styleUrls: ['./blotter-records.scss']
})
export class BlotterRecords implements OnInit {
  blotterCases: Blotter[] = [];
  filteredCases: Blotter[] = [];

  selectedStatus = '';
  searchText = '';

  showForm = false;

  constructor(private blotterService: BlotterService) {}

  ngOnInit(): void {
    this.blotterService.getAll().subscribe(data => {
      this.blotterCases = data || [];
      this.filterCases();
    });
  }

  filterCases(): void {
    const search = this.searchText.toLowerCase();

    this.filteredCases = this.blotterCases.filter(b => {
      const statusMatch = this.selectedStatus
        ? b.status === this.selectedStatus
        : true;

      const nameMatch = search
        ? (b.residentName || b.victims || '').toLowerCase().includes(search)
        : true;

      return statusMatch && nameMatch;
    });
  }

  addCase(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  async saveCase(data: Blotter): Promise<void> {
    const blotter: Blotter = {
      complaint: data.complaint,
      victims: data.victims,
      respondent: data.respondent,
      type: data.type,
      location: data.location,
      date: data.date,
      time: data.time,
      status: 'Active',
      description: data.description || '',
      residentName: data.victims,
      barangay: 'San Martin',
      isArchived: false
    };

    await this.blotterService.add(blotter);

    this.closeForm();

    Swal.fire('Saved', 'New blotter case saved as Active.', 'success');
  }

  async viewCase(blotter: Blotter): Promise<void> {
    const result = await Swal.fire({
      title: 'Blotter Details',
      html: `
        <p><b>Resident/Victim:</b> ${blotter.victims}</p>
        <p><b>Respondent:</b> ${blotter.respondent}</p>
        <p><b>Complaint:</b> ${blotter.complaint}</p>
        <p><b>Type:</b> ${blotter.type}</p>
        <p><b>Location:</b> ${blotter.location}</p>
        <p><b>Date:</b> ${blotter.date}</p>
        <p><b>Time:</b> ${blotter.time}</p>
        <p><b>Description:</b> ${blotter.description || 'No description'}</p>

        <select id="status" class="swal2-input">
          <option value="Active" ${blotter.status === 'Active' ? 'selected' : ''}>Active</option>
          <option value="Scheduled" ${blotter.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
          <option value="Settled" ${blotter.status === 'Settled' ? 'selected' : ''}>Settled</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update Status',
      cancelButtonText: 'Close',
      preConfirm: () => {
        return (document.getElementById('status') as HTMLSelectElement).value as Blotter['status'];
      }
    });

    if (!result.isConfirmed || !result.value || !blotter.id) return;

    await this.blotterService.update(blotter.id, {
      status: result.value
    });

    Swal.fire('Updated', 'Blotter status updated successfully.', 'success');
  }

  async archiveCase(blotter: Blotter): Promise<void> {
    if (!blotter.id) return;

    const result = await Swal.fire({
      title: 'Archive Case?',
      text: `Archive blotter case for ${blotter.victims}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Archive',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    await this.blotterService.archive(blotter.id);

    Swal.fire('Archived', 'Blotter case archived successfully.', 'success');
  }

  getCount(status: string): number {
    return this.blotterCases.filter(b => b.status === status).length;
  }
}