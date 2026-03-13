import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.scss']  
})
export class DashboardHome {
  // Temporary values — replace with actual data later
  totalPopulation: number = 1200;
  totalVoters: number = 800;
  totalMales: number = 600;
  totalFemales: number = 600;
}