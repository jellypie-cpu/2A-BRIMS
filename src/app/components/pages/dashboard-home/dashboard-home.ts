import { Component, OnInit } from '@angular/core';
import { ResidentService } from '../../../core/services/resident';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.scss'],
  imports: [RouterLink]
})
export class DashboardHome implements OnInit {

  totalPopulation = 0;
  totalVoters = 0;
  totalMales = 0;
  totalFemales = 0;

  allResidents: any[] = [];

  constructor(private residentService: ResidentService) {}

  ngOnInit() {
    this.loadResidents();
  }

  loadResidents() {
    this.allResidents = this.residentService.getAll();
    this.computeStats();
  }

  computeStats() {
    this.totalPopulation = this.allResidents.length;

    this.totalVoters = this.allResidents.filter(r => r.isVoter === true).length;

    this.totalMales = this.allResidents.filter(r => r.gender === 'Male').length;

    this.totalFemales = this.allResidents.filter(r => r.gender === 'Female').length;
  }
}