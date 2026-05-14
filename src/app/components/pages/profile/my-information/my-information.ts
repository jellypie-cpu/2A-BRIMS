import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth';
import { ResidentService } from '../../../../core/services/resident';
import { AppUser } from '../../../../core/models/user.model';
import { Resident } from '../../../../core/models/resident.model';

@Component({
  selector: 'app-my-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-information.html',
  styleUrls: ['./my-information.scss'],
})
export class ProfileMyInformation implements OnInit, OnDestroy {
  user: AppUser | null = null;
  resident: Resident | null = null;
  loading = true;

  private subscription = new Subscription();
  private residentSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private residentService: ResidentService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.user = user;
        this.residentSubscription?.unsubscribe();

        if (!user?.id) {
          this.resident = null;
          this.loading = false;
          return;
        }

        const residentDocId = user.residentId || user.id;

        this.loading = true;

        this.residentSubscription = this.residentService.getById(residentDocId).subscribe({
          next: resident => {
            this.resident = resident || null;
            this.loading = false;
          },
          error: () => {
            this.resident = null;
            this.loading = false;
          }
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.residentSubscription?.unsubscribe();
  }
}