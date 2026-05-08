import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth';
import { UserService } from '../../../../core/services/user';
import { ActivityLogService } from '../../../../core/services/activity-log';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
})
export class ProfileOverview implements OnInit {

  user: any;
  logs: any[] = [];

  profileImage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private logService: ActivityLogService
  ) {}

  ngOnInit() {

    this.user = this.authService.getCurrentUser();

    if (!this.user) return;

    this.profileImage = this.user.profileImage || '';

    this.logService.getLogs(this.user.id!)
      .subscribe(data => {
        this.logs = data;
      });
  }
}