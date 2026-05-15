import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../../../core/services/auth';
import { RequestService } from '../../../../core/services/document-request';
import { DocumentRequest } from '../../../../core/models/documentRequest.model';

@Component({
  selector: 'app-my-request-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './residents-request-history.html',
  styleUrl: './residents-request-history.scss',
})
export class MyRequestHistory implements OnInit, OnDestroy {
  requests: DocumentRequest[] = [];
  loading = true;

  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?.residentId) {
      this.loading = false;
      Swal.fire(
        'No Resident Profile Linked',
        'Your account is not linked to a resident profile.',
        'error'
      );
      return;
    }

    this.subscription.add(
      this.requestService.getByResident(currentUser.residentId).subscribe({
        next: requests => {
          this.requests = requests || [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Unable to load your request history.', 'error');
        }
      })
    );
  }

  formatDate(value: any): string {
    if (!value) return 'No date';

    const date = value?.toDate?.() ?? value;
    return new Date(date).toLocaleString();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'released':
        return 'Released';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}