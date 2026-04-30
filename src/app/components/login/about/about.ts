import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class About {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/login']); // change if your route is different
  }
}