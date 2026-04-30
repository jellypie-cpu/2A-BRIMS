import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BlotterForm } from './blotter-form/blotter-form';

interface BlotterCase {
  id: string;
  residentName: string;
  complaint: string;
  status: 'Active' | 'Settled' | 'Scheduled';
  date: string;
  description?: string;
}

@Component({
  selector: 'app-blotter-records',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, BlotterForm],
  templateUrl: './blotter-records.html',
  styleUrls: ['./blotter-records.scss']
})
export class BlotterRecords implements OnInit {

  blotterCases: BlotterCase[] = [];
  filteredCases: BlotterCase[] = [];

  selectedStatus: string = '';
  searchText: string = '';

  showForm = false;

  ngOnInit() {
    this.loadCases();
    this.filterCases();
  }

  // ======================
  // 💾 LOAD FROM STORAGE
  // ======================
  loadCases() {
    const data = localStorage.getItem('blotters');
    this.blotterCases = data ? JSON.parse(data) : [];
  }

  // ======================
  // 💾 SAVE TO STORAGE
  // ======================
  saveToStorage() {
    localStorage.setItem('blotters', JSON.stringify(this.blotterCases));
  }

  // ======================
  // 🔍 FILTER
  // ======================
  filterCases() {
    this.filteredCases = this.blotterCases.filter(b => {
      const matchesStatus = this.selectedStatus ? b.status === this.selectedStatus : true;

      const matchesName = this.searchText
        ? b.residentName?.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      return matchesStatus && matchesName;
    });
  }

  // ======================
  // ➕ OPEN MODAL
  // ======================
  addCase() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  // ======================
  // 💾 SAVE FROM MODAL
  // ======================
  saveCase(data: any) {

    const newCase: BlotterCase = {
      id: data.id,
      residentName: data.victims, // 👈 using victims as display name
      complaint: data.complaint,
      status: data.status,
      date: data.date,
      description: data.description
    };

    this.blotterCases.push(newCase);

    this.saveToStorage();
    this.filterCases();
    this.closeForm();
  }

  // ======================
  // 👁 VIEW
  // ======================
  viewCase(blotter: BlotterCase) {
  const newStatus = prompt(
    `Update status for ${blotter.residentName}\n\nType: Active / Settled / Scheduled`,
    blotter.status
  );

  if (!newStatus) return;

  if (!['Active', 'Settled', 'Scheduled'].includes(newStatus)) {
    alert('Invalid status!');
    return;
  }

  // ✅ UPDATE STATUS
  blotter.status = newStatus as any;

  // ✅ SAVE + REFRESH
  this.saveToStorage();
  this.filterCases();

  alert('Status updated!');
}

  // ======================
  // 🗑 DELETE
  // ======================
  deleteCase(blotter: BlotterCase) {
    const confirmDelete = confirm('Delete this case?');

    if (confirmDelete) {
      this.blotterCases = this.blotterCases.filter(b => b.id !== blotter.id);
      this.saveToStorage();
      this.filterCases();
    }
  }

  // ======================
  // 📊 COUNTS
  // ======================
  getCount(status: 'Active' | 'Settled' | 'Scheduled') {
    return this.blotterCases.filter(b => b.status === status).length;
  }
}