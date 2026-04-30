import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blotter-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blotter-form.html',
  styleUrls: ['./blotter-form.scss']
})
export class BlotterForm {

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  blotter: any = {
    complaint: '',
    victims: '',
    respondent: '',
    type: '',
    location: '',
    date: '',
    time: '',
    status: '',
    description: ''
  };

  onSubmit() {
    this.blotter.id = 'BLT-' + Date.now();
    this.save.emit(this.blotter);
    this.resetForm();
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

  resetForm() {
    this.blotter = {
      complaint: '',
      victims: '',
      respondent: '',
      type: '',
      location: '',
      date: '',
      time: '',
      status: '',
      description: ''
    };
  }
}