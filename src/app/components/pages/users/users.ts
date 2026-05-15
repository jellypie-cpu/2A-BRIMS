import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import Swal from 'sweetalert2';

import { UserService } from '../../../core/services/user';
import { AppUser, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users implements OnInit {
  users: AppUser[] = [];
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.userService.getUsers().subscribe({
      next: (users: AppUser[]) => {
        this.users = users || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Unable to load users.', 'error');
      }
    });
  }

  getRoleCount(role: UserRole): number {
    return this.users.filter(user => user.role === role).length;
  }

  async deleteUser(id: string): Promise<void> {
    if (!id) return;

    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'This will remove the user record from Firestore.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    await this.userService.deleteUser(id);

    Swal.fire('Deleted', 'User has been deleted.', 'success');
  }
}