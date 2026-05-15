import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-baranggay-clearance-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './baranggay-clearance-form.html',
  styleUrls: ['./baranggay-clearance-form.scss']
})
export class BaranggayClearanceForm {
  @Input() selectedResident: any;
  @Input() today: Date = new Date();

  @Output() close = new EventEmitter<void>();

  get age(): number {
    if (!this.selectedResident?.birthdate) return 0;

    const birthDate = new Date(this.selectedResident.birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }

    return age;
  }

  closePrint(): void {
    this.close.emit();
  }

  printClearance(): void {
    const printContents =
      document.getElementById('printArea')?.innerHTML;

    if (!printContents) return;

    const popup = window.open(
      '',
      '_blank',
      'width=900,height=1000'
    );

    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>Barangay Clearance</title>

          <style>
            body {
              margin: 0;
              padding: 25px;
              background: #ffffff;
              color: #000000;
              font-family: "Times New Roman", serif;
            }

            .outer-border {
              min-height: 1000px;
              padding: 45px 55px;
              border: 5px double #000000;
            }

            .certificate-header {
              display: grid;
              grid-template-columns: 120px 1fr 120px;
              align-items: center;
              text-align: center;
            }

            .logo-box img {
              width: 105px;
              height: 105px;
              object-fit: contain;
            }

            .header-text p {
              margin: 2px 0;
              font-size: 16px;
            }

            .header-text h1 {
              margin: 8px 0 0;
              font-size: 34px;
              font-style: italic;
              color: #0b305c;
              font-family: Georgia, "Times New Roman", serif;
            }

            .double-line {
              border-top: 4px double #000000;
              margin: 18px 0 45px;
            }

            .office-title {
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 28px;
            }

            .certificate-title {
              text-align: center;
              font-size: 34px;
              font-weight: bold;
              letter-spacing: 1px;
              margin-bottom: 60px;
            }

            .certificate-body {
              font-size: 17px;
              line-height: 2;
              text-align: justify;
            }

            .to-whom {
              font-weight: bold;
              margin-bottom: 45px;
            }

            .underline {
              display: inline-block;
              border-bottom: 1px solid #000000;
              text-align: center;
              line-height: 1.2;
              font-weight: bold;
            }

            .name {
              min-width: 300px;
            }

            .short {
              min-width: 70px;
            }

            .medium {
              min-width: 180px;
            }

            .address {
              min-width: 380px;
            }

            .signature-section {
              display: grid;
              grid-template-columns: 1fr 260px;
              margin-top: 95px;
            }

            .signature-box {
              text-align: center;
            }

            .captain-name {
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 0;
            }

            .footer-details {
              margin-top: 85px;
              font-size: 16px;
            }

            .footer-details p {
              margin: 6px 0;
            }

            .footer-line {
              display: inline-block;
              min-width: 180px;
              border-bottom: 1px solid #000000;
              margin-left: 10px;
              padding-left: 8px;
            }

            @page {
              size: A4;
              margin: 15mm;
            }
          </style>
        </head>

        <body onload="window.print(); window.close();">
          ${printContents}
        </body>
      </html>
    `);

    popup.document.close();
  }
}