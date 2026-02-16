import { Component, OnDestroy } from '@angular/core';
import { AuthService, User } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
    this.subscription = this.authService.currentUser$.subscribe((user: User | null) => {
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
    console.log('Go to profile page');
    this.showDropdown = false;
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
    console.log('Logged out');
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
