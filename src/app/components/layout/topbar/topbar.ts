import { Component, OnDestroy } from '@angular/core';
import { AuthService} from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppUser } from '../../../core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
})
export class TopbarComponent implements OnDestroy {
  username: string = '';
  showDropdown = false;
  userRole: string | null = null;
  private subscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    // Subscribe to current user changes
    this.subscription = this.authService.currentUser$.subscribe((user: AppUser | null) => {
      if (user) {
        this.username = user.username;
        this.userRole = user.role;
      } else {
        // No user logged in: redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goToProfile() {
  this.showDropdown = false;
  this.router.navigate(['/dashboard/profile']);
}

  logout() {
  // Hide dropdown immediately
  this.showDropdown = false;

  // Show confirmation dialog
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      async logout() {

  this.showDropdown = false;

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {

    await this.authService.logout();

    await this.router.navigate(['/login']);

    Swal.fire({
      icon: 'success',
      title: 'Logged out',
      timer: 1500,
      showConfirmButton: false
    });
  }
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
  }