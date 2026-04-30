import { Component, OnInit } from '@angular/core';
import { ResidentService } from '../../../core/services/resident';
import { AuthService } from '../../../core/services/auth';
import { AppUser } from '../../../core/models/user.model';
import { RouterLink } from "@angular/router";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.scss'],
  imports: [RouterLink, NgIf]
})
export class DashboardHome implements OnInit {

  role: string = '';

  totalPopulation = 0;
  totalVoters = 0;
  totalMales = 0;
  totalFemales = 0;

  allResidents: any[] = [];

  constructor(
    private residentService: ResidentService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user: AppUser | null = this.auth.getCurrentUser();

    if (user) {
      this.role = user.role;
    }

    // ONLY STAFF/ADMIN loads stats
    if (this.role === 'admin' || this.role === 'staff') {
      this.loadResidents();
    }
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