import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barangay-indigency-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './baranggay-indigency-form.html',
  styleUrls: ['./baranggay-indigency-form.scss']
})
export class BaranggayIndigencyForm implements OnInit {

  @Input() selectedResident: any;
  @Output() close = new EventEmitter<void>();

  today: Date = new Date();
  certificateNo: string = '';

  ngOnInit() {
    // 🔢 Generate official certificate number
    this.certificateNo = 'IND-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000);
  }

  closePrint() {
    this.close.emit();
  }

  printIndigency() {

    const printContents = document.getElementById('printArea')?.innerHTML;

    const popup = window.open('', '_blank', 'width=800,height=600');

    popup?.document.write(`
      <html>
        <head>
          <title>Barangay Indigency</title>

          <style>
            @page {
              size: A4;
              margin: 40px;
            }

            body {
              font-family: Arial, sans-serif;
            }

            .print-container {
              width: 100%;
            }

            .header {
              text-align: center;
            }

            .title {
              margin-top: 10px;
              font-size: 22px;
            }

            .body {
              margin-top: 30px;
              text-align: justify;
              line-height: 1.8;
            }

            .footer {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
            }

            .signature {
              text-align: center;
            }

            .qr {
              text-align: right;
              font-size: 12px;
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