import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../../core/services/auth';
import { AppUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class TopbarComponent implements OnDestroy {
  username = '';
  showDropdown = false;
  userRole: string | null = null;

  private subscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.subscription = this.authService.currentUser$.subscribe((user: AppUser | null) => {
      if (user) {
        this.username = user.username;
        this.userRole = user.role;
        return;
      }

      this.router.navigate(['/login']);
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  goToProfile(): void {
    this.showDropdown = false;
    this.router.navigate(['/dashboard/profile']);
  }

  async logout(): Promise<void> {
    this.showDropdown = false;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    await this.authService.logout();
    await this.router.navigate(['/login']);

    await Swal.fire({
      icon: 'success',
      title: 'Logged out',
      timer: 1500,
      showConfirmButton: false
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}