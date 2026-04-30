import { Component, OnInit } from '@angular/core';
import { AuthService, LoginRecord } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users implements OnInit {
  loginHistory: LoginRecord[] = [];
  totalLoginsToday: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Load login history and total logins today
    this.loginHistory = this.authService.getLoginHistory();
    this.totalLoginsToday = this.authService.getTodaysLogins();
  }
}