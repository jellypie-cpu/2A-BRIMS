import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { UserService } from '../../../core/services/user';
import { AppUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users implements OnInit {

  users: AppUser[] = [];
  loading = true;

  // ✅ FIX: inject service properly
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    this.userService.getUsers().subscribe((users: AppUser[]) => {
      this.users = users;
      this.loading = false;
    });
  }

  async deleteUser(id: string) {

    await this.userService.deleteUser(id);

    this.loadUsers();
  }
}