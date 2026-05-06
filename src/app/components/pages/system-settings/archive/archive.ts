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
    const all = this.residentService.getAll();
    this.archivedResidents = all.filter(r => r.isArchived);
  }

  restore(resident: any) {
    const all = this.residentService.getAll();

    const index = all.findIndex(r => r.id === resident.id);

    if (index !== -1) {
      all[index].isArchived = false;
    }

    this.residentService.saveAll(all);
    this.loadArchived();
  }
}