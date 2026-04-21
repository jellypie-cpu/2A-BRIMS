import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
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

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  zones = [1,2,3,4,5,6,7,8,9,10,11,12];

  resident: any = this.getEmptyResident();

  // =========================
  // LOAD DATA (ADD / VIEW / EDIT)
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
        zone: null,
        street: '',
        barangay: ''
      },
      photo: null
    };
  }

  // =========================
  // ENABLE EDIT (from VIEW mode)
  // =========================
  enableEdit() {
    this.isEditMode = true;
  }

  // =========================
  // SAVE
  // =========================
  onSubmit() {
    this.save.emit(this.resident);
  }

  // =========================
  // CLOSE
  // =========================
  onClose() {
    this.close.emit();
  }

  // =========================
  // PHOTO UPLOAD
  // =========================
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.resident.photo = reader.result;
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

          this.resident.photo = canvas.toDataURL('image/png');

          stream.getTracks().forEach(track => track.stop());
        }, 2000);
      })
      .catch(() => {
        alert('Camera not available or permission denied');
      });
  }
}