import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-baranggay-clearance-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './baranggay-clearance-form.html',
  styleUrls: ['./baranggay-clearance-form.scss']
})
export class BaranggayClearanceForm {

  // ======================
  // INPUT FROM PARENT
  // ======================
  @Input() selectedResident: any;
  @Input() today: Date = new Date();

  // ======================
  // CLOSE MODAL EVENT
  // ======================
  @Output() close = new EventEmitter<void>();

  // ======================
  // CLOSE MODAL
  // ======================
  closePrint() {
    this.close.emit();
  }

  // ======================
  // PRINT FUNCTION
  // ======================
  printClearance() {

    const printContents = document.getElementById('printArea')?.innerHTML;

    const popup = window.open('', '_blank', 'width=800,height=600');

    popup?.document.write(`
      <html>
        <head>
          <title>Barangay Clearance</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              text-align: center;
            }

            .print-container {
              border: 2px solid black;
              padding: 30px;
            }

            h2, h3 {
              margin: 0;
            }

            hr {
              margin: 20px 0;
            }

            .body {
              text-align: left;
              margin-top: 20px;
              line-height: 1.8;
            }

            .footer {
              margin-top: 50px;
            }
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