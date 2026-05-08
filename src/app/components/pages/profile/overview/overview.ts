import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth';
import { UserService } from '../../../../core/services/user';

import { AppUser } from '../../../../core/models/user.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
})
export class ProfileOverview implements OnInit {

  currentUser: AppUser | null = null;

  adminName = '';
  profileImage = '';

  activityLogs: any[] = [];

  loading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {

    const user = this.authService.getCurrentUser();

    if (!user?.id) {
      this.loading = false;
      return;
    }

    this.userService.getUserById(user.id)
      .subscribe((data) => {

        this.currentUser = data;

        this.adminName = data.username;
        this.profileImage = data.profileImage || '';

        this.activityLogs = data.activityLogs || [];

        this.loading = false;
      });
  }

  // =========================
  // UPLOAD PROFILE IMAGE
  // =========================
  async onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length || !this.currentUser?.id) {
      return;
    }

    const file = input.files[0];

    try {

      this.loading = true;

      const imageUrl = await this.userService.uploadProfileImage(
        this.currentUser.id,
        file
      );

      this.profileImage = imageUrl;

      await this.userService.addActivityLog(
        this.currentUser.id,
        'Updated profile picture'
      );

      alert('Profile picture updated successfully.');

    } catch (error) {

      console.error(error);

      alert('Failed to upload image.');
    }

    this.loading = false;
  }
}