import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { RequestService } from '../../../core/services/document-request';
import { DocumentRequest } from '../../../core/models/documentRequest.model';

@Component({
  selector: 'app-certificates-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificates-request.html',
  styleUrl: './certificates-request.scss',
})
export class CertificatesRequest implements OnInit, OnDestroy {
  requests: DocumentRequest[] = [];
  filteredRequests: DocumentRequest[] = [];
  selectedStatus: DocumentRequest['status'] | 'all' = 'all';
  searchText = '';
  loading = true;

  private subscription = new Subscription();

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.requestService.getAll().subscribe({
        next: requests => {
          this.requests = requests || [];
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Unable to load certificate requests from Firestore.', 'error');
        }
      })
    );
  }

  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredRequests = this.requests.filter(request => {
      const matchesStatus = this.selectedStatus === 'all' || request.status === this.selectedStatus;
      const matchesSearch = !search ||
        request.residentName?.toLowerCase().includes(search) ||
        request.residentEmail?.toLowerCase().includes(search) ||
        request.type?.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  countByStatus(status: DocumentRequest['status']): number {
    return this.requests.filter(request => request.status === status).length;
  }

  async updateStatus(request: DocumentRequest, status: DocumentRequest['status']): Promise<void> {
    if (!request.id || request.status === status) return;

    await this.requestService.updateStatus(request.id, status);
    Swal.fire('Updated', `Request marked as ${status}.`, 'success');
  }

  formatDate(value: any): string {
    if (!value) return 'No date';

    const date = value?.toDate?.() ?? value;
    return new Date(date).toLocaleString();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}