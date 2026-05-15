import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { ResidentService } from '../../../../core/services/resident';
import { Resident } from '../../../../core/models/resident.model';

import { BlotterService } from '../../../../core/services/blotter';
import { Blotter } from '../../../../core/models/blotter';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive.html',
  styleUrls: ['./archive.scss']
})
export class Archive implements OnInit {
  archivedResidents: Resident[] = [];
  archivedBlotters: Blotter[] = [];

  loadingResidents = true;
  loadingBlotters = true;

  constructor(
    private residentService: ResidentService,
    private blotterService: BlotterService
  ) {}

  ngOnInit(): void {
    this.loadArchivedResidents();
    this.loadArchivedBlotters();
  }

  loadArchivedResidents(): void {
    this.loadingResidents = true;

    this.residentService.getArchived().subscribe({
      next: (residents) => {
        this.archivedResidents = residents || [];
        this.loadingResidents = false;
      },
      error: () => {
        this.loadingResidents = false;
        Swal.fire('Error', 'Unable to load archived residents.', 'error');
      }
    });
  }

  loadArchivedBlotters(): void {
    this.loadingBlotters = true;

    this.blotterService.getArchived().subscribe({
      next: (blotters) => {
        this.archivedBlotters = blotters || [];
        this.loadingBlotters = false;
      },
      error: () => {
        this.loadingBlotters = false;
        Swal.fire('Error', 'Unable to load archived blotter records.', 'error');
      }
    });
  }

  async restoreResident(resident: Resident): Promise<void> {
    if (!resident.id) return;

    const result = await Swal.fire({
      title: 'Restore Resident?',
      text: `Restore ${resident.fullname || 'this resident'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#64748b'
    });

    if (!result.isConfirmed) return;

    try {
      await this.residentService.restore(resident.id);

      Swal.fire({
        title: 'Restored',
        text: 'Resident restored successfully.',
        icon: 'success',
        confirmButtonColor: '#16a34a'
      });
    } catch {
      Swal.fire('Error', 'Unable to restore resident.', 'error');
    }
  }

  async restoreBlotter(blotter: Blotter): Promise<void> {
    if (!blotter.id) return;

    const result = await Swal.fire({
      title: 'Restore Blotter?',
      text: `Restore blotter case for ${blotter.victims || 'this record'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#64748b'
    });

    if (!result.isConfirmed) return;

    try {
      await this.blotterService.restore(blotter.id);

      Swal.fire({
        title: 'Restored',
        text: 'Blotter record restored successfully.',
        icon: 'success',
        confirmButtonColor: '#16a34a'
      });
    } catch {
      Swal.fire('Error', 'Unable to restore blotter record.', 'error');
    }
  }
}