import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SystemSettingsService } from '../../../core/services/system-settings';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './system-settings.html',
  styleUrls: ['./system-settings.scss'],
})
export class SystemSettings implements OnInit {

  settings: any = null;
  loading = true;

  constructor(private settingsService: SystemSettingsService) {}

  ngOnInit() {

    this.settingsService.getSettings().subscribe(data => {
      this.settings = data;
      this.loading = false;
    });
  }

  async saveSettings() {

    await this.settingsService.updateSettings(this.settings);

    alert('System settings updated successfully!');
  }
}