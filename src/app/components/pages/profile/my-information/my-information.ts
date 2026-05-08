import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth';
import { ResidentService } from '../../../../core/services/resident';

@Component({
  selector: 'app-my-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-information.html',
  styleUrl: './my-information.scss',
})
export class ProfileMyInformation implements OnInit {

  currentUser: any = null;
  resident: any = null;

  loading = true;

  constructor(
    private authService: AuthService,
    private residentService: ResidentService
  ) {}

  ngOnInit() {

    const user = this.authService.getCurrentUser();

    if (!user) {
      this.loading = false;
      return;
    }

    this.currentUser = user;

    // RESIDENT ACCOUNT
    if (user.residentId) {

      this.residentService
        .getById(user.residentId)
        .subscribe(resident => {

          this.resident = resident;
          this.loading = false;
        });

      return;
    }

    // FALLBACK USING userId FIELD
    this.residentService
      .getByUserId(user.id!)
      .subscribe((residents: any[]) => {

        this.resident = residents[0] || null;
        this.loading = false;
      });
  }
}