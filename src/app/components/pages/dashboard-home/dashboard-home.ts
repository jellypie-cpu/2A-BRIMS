import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResidentService } from '../../../core/services/resident';
import { AuthService } from '../../../core/services/auth';
import { AppUser } from '../../../core/models/user.model';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notifications';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.scss'],
  imports: [RouterLink, NgIf]
})
export class DashboardHome implements OnInit, OnDestroy {
  role = '';

  totalPopulation = 0;
  totalVoters = 0;
  totalMales = 0;
  totalFemales = 0;
  notificationCount = 0;

  allResidents: any[] = [];
  private subscription = new Subscription();

  constructor(
    private residentService: ResidentService,
    private auth: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.auth.currentUser$.subscribe((user: AppUser | null) => {
        this.role = user?.role || '';

        if (this.role === 'admin' || this.role === 'staff') {
          this.loadResidents();
          this.loadNotifications();
        }
      })
    );
  }

  loadResidents() {
    if (this.allResidents.length > 0) {
      return;
    }

    this.subscription.add(
      this.residentService.getActive().subscribe(residents => {
        this.allResidents = residents || [];
        this.computeStats();
      })
    );
  }

  loadNotifications() {
    this.subscription.add(
      this.notificationService.getUnreadCountForRole(this.role).subscribe(count => {
        this.notificationCount = count;
      })
    );
  }

  computeStats() {
    this.totalPopulation = this.allResidents.length;
    this.totalVoters = this.allResidents.filter(r => r.isVoter).length;
    this.totalMales = this.allResidents.filter(r => r.gender === 'Male').length;
    this.totalFemales = this.allResidents.filter(r => r.gender === 'Female').length;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}