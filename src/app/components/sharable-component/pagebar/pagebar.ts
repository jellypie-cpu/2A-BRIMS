import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';

@Component({
  selector: 'app-pagebar',
  standalone: true,
  imports: [CommonModule,RouterModule,],
  templateUrl: './pagebar.html',
  styleUrls: ['./pagebar.scss']
})
export class Pagebar implements OnChanges {
  @Input() pageTitle: string = '';
  pageSegments: string[] = [];

  constructor(private router: Router) {}

  ngOnChanges() {
    this.setSegments();
  }

  setSegments() {
    // split the route by "/"
    const path = this.router.url.replace('/dashboard/', '');
    this.pageSegments = path ? path.split('/') : [];
  }

  formatSegment(segment: string): string {
    // convert kebab-case to readable
    return segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getSegmentLink(segment: string): string {
    const index = this.pageSegments.indexOf(segment);
    return '/dashboard/' + this.pageSegments.slice(0, index + 1).join('/');
  }
}