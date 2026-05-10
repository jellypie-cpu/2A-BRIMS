import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth';
import { ResidentService } from '../../../../core/services/resident';

@Component({
  selector: 'app-my-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-information.html',
  styleUrls: ['./my-information.scss'],
})
export class ProfileMyInformation implements OnInit {
  user: any;
  resident: any;
  loading = true;

  constructor(
    private authService: AuthService,
    private residentService: ResidentService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    if (!this.user) {
      this.loading = false;
      return;
    }

    const userId = this.user.id;

    if (this.user.residentId) {
      this.residentService.getById(this.user.residentId)
        .subscribe(data => {
          this.resident = data;
          this.loading = false;
        });
    } else {
      this.resident = null;
      this.loading = false;
    }
  }
}