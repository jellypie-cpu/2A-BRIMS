import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Blotter } from '../../../../core/models/blotter';

@Component({
  selector: 'app-blotter-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blotter-form.html',
  styleUrls: ['./blotter-form.scss']
})
export class BlotterForm {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Blotter>();

  blotter: Blotter = this.getEmptyBlotter();

  getEmptyBlotter(): Blotter {
    return {
      complaint: '',
      victims: '',
      respondent: '',
      type: '',
      location: '',
      date: '',
      time: '',
      status: 'Active',
      description: '',
      isArchived: false
    };
  }

  onSubmit(): void {
    this.blotter.status = 'Active';
    this.save.emit(this.blotter);
    this.resetForm();
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  resetForm(): void {
    this.blotter = this.getEmptyBlotter();
  }
}