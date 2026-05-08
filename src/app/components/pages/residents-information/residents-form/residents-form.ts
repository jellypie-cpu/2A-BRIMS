import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges
} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resident-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './residents-form.html',
  styleUrls: ['./residents-form.scss'],
})
export class ResidentForm implements OnChanges {

  @Input() residentData: any = null;
  @Input() isEditMode: boolean = false;
  @Input() allResidents: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  zones = [1,2,3,4,5,6,7,8,9,10,11,12];

  resident: any = this.getEmptyResident();

  // ✅ FILE HOLDER
  selectedFile: File | null = null;

  // =========================
  // LOAD DATA
  // =========================
  ngOnChanges() {

    if (this.residentData) {

      this.resident = structuredClone(this.residentData);

    } else {

      this.resident = this.getEmptyResident();
    }
  }

  // =========================
  // EMPTY TEMPLATE
  // =========================
  getEmptyResident() {

    return {
      fullname: '',
      birthdate: '',
      civilStatus: '',
      gender: '',
      isVoter: false,

      address: {
        zone: 0,
        street: '',
        barangay: ''
      },

      photo: null,
      photoPreview: null
    };
  }

  // =========================
  // ENABLE EDIT
  // =========================
  enableEdit() {
    this.isEditMode = true;
  }

  // =========================
  // DUPLICATE CHECK
  // =========================
  checkDuplicateLive(): boolean {

    return this.allResidents.some(r =>

      r.id !== this.resident.id &&

      r.fullname?.trim().toLowerCase() ===
      this.resident.fullname?.trim().toLowerCase()

      &&

      r.birthdate === this.resident.birthdate
    );
  }

  // =========================
  // SAVE
  // =========================
  onSubmit() {

    this.resident.selectedFile = this.selectedFile;

    this.save.emit(this.resident);
  }

  // =========================
  // CLOSE
  // =========================
  onClose() {
    this.close.emit();
  }

 //file selection handler

onFileSelected(event: any) {

  const file = event.target.files[0];

  if (!file) return;

  this.selectedFile = file;

  this.resident.selectedFile = file;

  const reader = new FileReader();

  reader.onload = () => {
   this.resident.photoPreview = reader.result;
  };

  reader.readAsDataURL(file);
}

  // =========================
  // CAMERA
  // =========================
  openCamera() {

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

        canvas.toBlob((blob) => {

          if (!blob) return;

          const file = new File(
            [blob],
            `resident-${Date.now()}.png`,
            { type: 'image/png' }
          );

          this.selectedFile = file;

          this.resident.selectedFile = file;

          this.resident.photo = URL.createObjectURL(file);

        }, 'image/png');

        stream.getTracks().forEach(track => track.stop());

      }, 2000);

    })
    .catch(() => {
      alert('Camera permission denied');
    });
}
}