import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth';
import { UserService } from '../../../../core/services/user';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-settings.html',
  styleUrls: ['./account-settings.scss'],
})
export class ProfileAccountSettings implements OnInit {

  user: any = null;

  username = '';
  email = '';

  loading = true;
  isResident = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    if (!this.user) {
      this.loading = false;
      return;
    }

    this.username = this.user.username || '';
    this.email = this.user.email || '';

    this.isResident =
      this.user.role?.toLowerCase() === 'resident' ||
      this.user.userType?.toLowerCase() === 'resident';

    this.loading = false;
  }

  async saveSettings() {
    if (!this.user?.id) return;

    await this.userService.updateUser(this.user.id, {
      username: this.username,
      email: this.email
    });

    alert('Account updated successfully!');
  }
}