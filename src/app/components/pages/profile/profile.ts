import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/services/auth';
import { ResidentService } from '../../../core/services/resident';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  user: any;
  resident: any;
  loading = true;

  constructor(
    private authService: AuthService,
    private residentService: ResidentService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    if (!this.user?.id) {
      this.loading = false;
      return;
    }

    this.residentService.getById(this.user.id).subscribe({
      next: (resident: any) => {
        this.resident = resident;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}