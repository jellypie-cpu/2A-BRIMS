import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barangay-permit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './baranggay-permit-form.html',
  styleUrls: ['./baranggay-permit-form.scss']
})
export class BaranggayPermitForm {

  @Input() selectedResident: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  businessName: string = '';
  businessType: string = '';
  address: string = '';

  today: Date = new Date();

  closeModal() {
    this.close.emit();
  }

  submitPermit() {

    this.save.emit({
      resident: this.selectedResident,
      businessName: this.businessName,
      businessType: this.businessType,
      address: this.address
    });

    this.closeModal();
  }

  printPermit() {

    const printContents = document.getElementById('printArea')?.innerHTML;

    const popup = window.open('', '_blank', 'width=800,height=600');

    popup?.document.write(`
      <html>
        <head>
          <title>Barangay Permit</title>
          <style>
            body { font-family: Arial; padding: 40px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContents}
        </body>
      </html>
    `);

    popup?.document.close();
  }
}