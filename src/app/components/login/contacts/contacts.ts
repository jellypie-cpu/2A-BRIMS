import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { ConcernService } from '../../../core/services/concerns';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.scss'],
})
export class Contacts {
  name = '';
  email = '';
  message = '';
  sending = false;
  successMessage = '';

  constructor(
    private router: Router,
    private concernService: ConcernService
  ) {}

  goBack() {
    this.router.navigate(['/login']);
  }

  async sendMessage() {
    if (!this.name || !this.email || !this.message) {
      Swal.fire('Incomplete Form', 'Please complete all fields.', 'warning');
      return;
    }

    this.sending = true;

    try {
      await this.concernService.sendConcern({
        name: this.name,
        email: this.email,
        message: this.message
      });
this.successMessage = 'Your concern was sent successfully to barangay staff.';

      Swal.fire(
        'Message Sent',
        'Your concern was sent to barangay staff.',
        'success'
      );

      this.name = '';
      this.email = '';
      this.message = '';
    } catch {
      Swal.fire('Error', 'Failed to send concern.', 'error');
    }

    this.sending = false;
  }
}