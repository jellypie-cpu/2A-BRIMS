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
  selectedZone: number = 1;

  allResidents: any[] = [];
  residents: any[] = [];
  searchText = '';

 //form for the resident details

  showForm = false;
  selectedResident: any = null;
  isEditMode: boolean = false;

  constructor(private residentService: ResidentService) {}
 
// INIT
  ngOnInit() {
    this.allResidents = this.residentService.getAll();
    this.filterResidents();
  }

//filtering the residents list based on zone and search text
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
    const index = all.findIndex(r => r.id === resident.id);

    if (index !== -1) {
      
      // UPDATE
      all[index] = resident;
    } else {

      // ADD NEW
          resident.id = 'RES-' + Date.now();
      all.push(resident);
    }

    this.residentService.saveAll(all);

    this.allResidents = all;
    this.filterResidents();
    this.closeForm();
  }
  //delete resident
  deleteResident(resident: any) {
    if (confirm('Delete ' + resident.fullname + '?')) {
      this.residentService.delete(resident.id);
      this.allResidents = this.residentService.getAll();
      this.filterResidents();
    }
  }
}