import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidentService } from '../../../../core/services/resident';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive.html',
  styleUrls: ['./archive.scss']
})
export class Archive implements OnInit {

  archivedResidents: any[] = [];

  constructor(private residentService: ResidentService) {}

  ngOnInit() {
    this.loadArchived();
  }

  loadArchived() {
    this.residentService.getAll().subscribe(residents => {
      this.archivedResidents = (residents || []).filter(r => r.isArchived === true);
    });
  }

  async restore(resident: any) {
    await this.residentService.update(resident.id, {
      isArchived: false
    });

    this.loadArchived();
  }
}