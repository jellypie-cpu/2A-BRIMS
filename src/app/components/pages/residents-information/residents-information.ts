import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentForm } from './residents-form/residents-form';

@Component({
  selector: 'app-residents-information',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentForm],
  templateUrl: './residents-information.html',
  styleUrls: ['./residents-information.scss'],
})
export class ResidentsInformation implements OnInit {

  // ======================
  // DATA
  // ======================
  zones = [1,2,3,4,5,6,7,8,9,10,11,12];
  selectedZone: number = 1;

  allResidents: any[] = [];
  residents: any[] = [];
  searchText = '';

  // ======================
  // MODAL STATE
  // ======================
  showForm = false;
  selectedResident: any = null;
  isEditMode: boolean = false;

  // ======================
  // INIT
  // ======================
  ngOnInit() {
    this.loadResidents();
    this.filterResidents();
  }

  // ======================
  // LOAD FROM STORAGE
  // ======================
  loadResidents() {
    const data = localStorage.getItem('residents');
    this.allResidents = data ? JSON.parse(data) : [];
  }

  // ======================
  // SAVE TO STORAGE
  // ======================
  saveToStorage() {
    localStorage.setItem('residents', JSON.stringify(this.allResidents));
  }

  // ======================
  // FILTER
  // ======================
  filterResidents() {

    let filtered = this.allResidents.filter(
      r => Number(r.address?.zone) === Number(this.selectedZone)
    );

    if (this.searchText.trim()) {
      const lower = this.searchText.toLowerCase();
      filtered = filtered.filter(r =>
        r.fullname.toLowerCase().includes(lower)
      );
    }

    this.residents = filtered;
  }

  onSearchChange() {
    this.filterResidents();
  }

  // ======================
  // ADD RESIDENT
  // ======================
  addResident() {
    this.selectedResident = null;
    this.isEditMode = true; // ADD MODE
    this.showForm = true;
  }

  // ======================
  // VIEW RESIDENT
  // ======================
  openResident(resident: any) {
    this.selectedResident = structuredClone(resident);
    this.isEditMode = false; // VIEW MODE FIRST
    this.showForm = true;
  }

  // ======================
  // CLOSE MODAL
  // ======================
  closeForm() {
    this.showForm = false;
  }

  // ======================
  // SAVE (ADD + UPDATE)
  // ======================
  saveResident(resident: any) {

    const index = this.allResidents.findIndex(r => r.id === resident.id);

    if (index !== -1) {
      // UPDATE
      this.allResidents[index] = resident;
    } else {
      // ADD NEW
      const newId =
        'RES-' +
        (this.allResidents.length + 1).toString().padStart(3, '0');

      resident.id = newId;
      this.allResidents.push(resident);
    }

    this.saveToStorage();
    this.loadResidents();
    this.filterResidents();
    this.closeForm();
  }

  // ======================
  // DELETE
  // ======================
  deleteResident(resident: any) {

    const confirmDelete = confirm('Delete ' + resident.fullname + '?');

    if (confirmDelete) {
      this.allResidents = this.allResidents.filter(
        r => r.id !== resident.id
      );

      this.saveToStorage();
      this.filterResidents();
    }
  }
}