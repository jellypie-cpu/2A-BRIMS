import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { AuthService } from '../../../core/services/auth';
import { RequestService } from '../../../core/services/document-request';
import { DocumentRequestType } from '../../../core/models/documentRequest.model';

@Component({
  selector: 'app-barangay-certificates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barangay-certificates.html',
  styleUrl: './barangay-certificates.scss',
})
export class BarangayCertificates {
  loadingType = '';

  certificateTypes: {
    type: DocumentRequestType;
    icon: string;
    description: string;
  }[] = [
    {
      type: 'Barangay Clearance',
      icon: '📄',
      description: 'Request official barangay clearance.'
    },
    {
      type: 'Certificate of Residency',
      icon: '💳',
        description: 'Request certificate of indigency.'
      },
    {
      type: 'Barangay Permit',
      icon: '🏢',
      description: 'Request barangay permit.'
    }
  ];

  constructor(
    private authService: AuthService,
    private requestService: RequestService
  ) {}

  async requestCertificate(type: DocumentRequestType): Promise<void> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?.residentId) {
      Swal.fire(
        'No Resident Profile Linked',
        'Your account must be linked to a resident profile before requesting documents.',
        'error'
      );
      return;
    }

    const result = await Swal.fire({
      title: `Request ${type}`,
      input: 'textarea',
      inputLabel: 'Purpose',
      inputPlaceholder: 'Enter your purpose...',
      showCancelButton: true,
      confirmButtonText: 'Submit Request',
      cancelButtonText: 'Cancel',
      inputValidator: value => {
        if (!value || !value.trim()) {
          return 'Purpose is required.';
        }

        return null;
      }
    });

    if (!result.isConfirmed) return;

    try {
      this.loadingType = type;

      await this.requestService.create(
        currentUser.residentId,
        type,
        currentUser.username || '',
        currentUser.email || '',
        result.value.trim()
      );

      Swal.fire(
        'Request Submitted',
        `${type} request submitted successfully.`,
        'success'
      );
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message || 'Failed to submit certificate request.',
        'error'
      );
    } finally {
      this.loadingType = '';
    }
  }
}