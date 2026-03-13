import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopbarComponent } from '../topbar/topbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { Pagebar } from '../../sharable-component/pagebar/pagebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    SidebarComponent,
    Pagebar
  ],
  templateUrl: './main-dashboard.html',
  styleUrls: ['./main-dashboard.scss'],
})
export class DashboardLayout {
  currentPage: string = 'Home';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url.split('/').pop();
        this.currentPage = url ? this.formatPageName(url) : 'Home';
      });
  }

  private formatPageName(page: string): string {
    // Converts "residents-information" -> "Residents Information"
    return page.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}