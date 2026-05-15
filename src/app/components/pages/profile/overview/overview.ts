import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../core/services/auth';
import { ResidentService } from '../../../../core/services/resident';
import { ActivityLogService } from '../../../../core/services/activity-log';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
})
export class ProfileOverview implements OnInit, OnDestroy {
  user: any = null;
  resident: any = null;
  logs: any[] = [];
  loading = true;

  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private residentService: ResidentService,
    private logService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.user = user;

        if (!user?.id) {
          this.loading = false;
          return;
        }

        const residentId = user.residentId || user.id;

        this.subscription.add(
          this.residentService.getById(residentId).subscribe(resident => {
            this.resident = resident || null;
            this.loading = false;
          })
        );

        this.subscription.add(
          this.logService.getLogs(user.id).subscribe(logs => {
            this.logs = logs || [];
          })
        );
      })
    );
  }

  get profileImage(): string {
    return this.user?.profileImage || this.resident?.photo || '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}