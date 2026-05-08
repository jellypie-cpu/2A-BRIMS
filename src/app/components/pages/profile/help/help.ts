import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HelpService } from '../../../../core/services/help';
import { serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.html',
  styleUrls: ['./help.scss'],
})
export class ProfileHelp implements OnInit {

  // FAQ (static or later from Firestore)
  faqs = [
    {
      question: 'How do I update my profile?',
      answer: 'Go to My Information and edit your details then save.'
    },
    {
      question: 'How do I request certificates?',
      answer: 'Go to Barangay Certificates section and choose the document type.'
    },
    {
      question: 'How long does approval take?',
      answer: 'Usually 1–3 working days depending on request volume.'
    }
  ];

  // Help request form
  subject = '';
  message = '';

  // user tickets
  tickets: any[] = [];

  constructor(private helpService: HelpService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.helpService.getUserTickets().subscribe(data => {
      this.tickets = data;
    });
  }

  submitHelp() {

    const ticket = {
      subject: this.subject,
      message: this.message,
      status: 'Pending',
      createdAt: serverTimestamp()
    };

    this.helpService.createTicket(ticket);

    this.subject = '';
    this.message = '';

    alert('Help request submitted!');
  }
}