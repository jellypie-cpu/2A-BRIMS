import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { ResidentService } from '../../../../core/services/resident';
import { Resident } from '../../../../core/models/resident.model';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive.html',
  styleUrls: ['./archive.scss']
})
export class Archive implements OnInit {
  archivedResidents: Resident[] = [];
  loading = true;

  constructor(private residentService: ResidentService) {}

  ngOnInit(): void {
    this.loadArchivedResidents();
  }

  loadArchivedResidents(): void {
    this.loading = true;

    this.residentService.getArchived().subscribe({
      next: residents => {
        this.archivedResidents = residents || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Unable to load archived residents.', 'error');
      }
    });
  }

  async restoreResident(resident: Resident): Promise<void> {
    if (!resident.id) return;

    const result = await Swal.fire({
      title: 'Restore Resident?',
      text: `Restore ${resident.fullname}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Restore',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    await this.residentService.restore(resident.id);

    Swal.fire('Restored', 'Resident restored successfully.', 'success');
  }
}