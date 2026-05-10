import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './system-settings.html',
  styleUrls: ['./system-settings.scss'],
})
export class SystemSettings {}