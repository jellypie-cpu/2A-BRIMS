import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Resident } from '../../../../core/models/resident.model';
import { AppUser } from '../../../../core/models/user.model';

@Component({
  selector: 'app-resident-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './residents-form.html',
  styleUrls: ['./residents-form.scss'],
})
export class ResidentForm implements OnChanges {

  @Input() residentData: Resident | null = null;
  @Input() isEditMode = false;
  @Input() allResidents: Resident[] = [];
  @Input() residentUsers: AppUser[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Resident>();

  zones = ['1','2','3','4','5','6','7','8','9','10','11','12'];

  resident: Resident = this.getEmptyResident();
  submitted = false;

  ngOnChanges(): void {
    this.submitted = false;

    if (this.residentData) {
      this.resident = structuredClone(this.residentData);
    } else {
      this.resident = this.getEmptyResident();
    }
  }

  getEmptyResident(): Resident {
    return {
      id: '',
      userId: '',
      userEmail: '',
      fullname: '',
      birthdate: '',
      civilStatus: '',
      gender: '',
      contactNumber: '',
      isVoter: false,
      isArchived: false,
      photo: null,

      address: {
        zone: '',
        street: '',
        barangay: ''
      }
    };
  }

  enableEdit(): void {
    this.isEditMode = true;
  }

  get missingFields(): string[] {
    const missing: string[] = [];

    if (!this.resident.userId) missing.push('Resident User Account');
    if (!this.resident.userEmail) missing.push('User Email');
    if (!this.resident.fullname?.trim()) missing.push('Full Name');
    if (!this.resident.birthdate) missing.push('Birthdate');
    if (!this.resident.civilStatus) missing.push('Civil Status');
    if (!this.resident.gender) missing.push('Gender');
    if (!this.resident.contactNumber?.trim()) missing.push('Contact Number');
    if (!this.resident.address.zone) missing.push('Zone');
    if (!this.resident.address.street?.trim()) missing.push('Street');
    if (!this.resident.address.barangay?.trim()) missing.push('Barangay');

    return missing;
  }

  checkDuplicateLive(): boolean {
    if (!this.resident.fullname || !this.resident.birthdate) {
      return false;
    }

    return this.allResidents.some(r =>
      r.id !== this.resident.id &&
      r.fullname?.trim().toLowerCase() === this.resident.fullname.trim().toLowerCase() &&
      r.birthdate === this.resident.birthdate
    );
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.missingFields.length > 0) return;

    if (this.checkDuplicateLive()) return;

    // FORCE RESIDENT DOC ID = USER ID
    this.resident.id = this.resident.userId;

    this.save.emit(this.resident);
  }

  onClose(): void {
    this.close.emit();
  }

  onUserSelected(): void {
    const selectedUser = this.residentUsers.find(
      user => user.id === this.resident.userId
    );

    if (!selectedUser) {
      this.resident.userEmail = '';
      return;
    }

   this.resident.userId = selectedUser.id || '';
    this.resident.userEmail = selectedUser.email || '';

    // Optional autofill
    if (!this.resident.fullname?.trim()) {
      this.resident.fullname = selectedUser.username || '';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    if (file.size > 500 * 1024) {
      alert('Image must be below 500KB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.resident.photo = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  openCamera(): void {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {

        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        const canvas = document.createElement('canvas');

        setTimeout(() => {

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');

          ctx?.drawImage(video, 0, 0);

          this.resident.photo = canvas.toDataURL(
            'image/jpeg',
            0.6
          );

          stream.getTracks().forEach(track => track.stop());

        }, 1000);

      })
      .catch(() => {
        alert('Camera access denied or unavailable.');
      });
  }
}