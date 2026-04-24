import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, CommonModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
 name: string = '';
  email: string = '';
  message: string = '';
  successMessage: string = '';

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/login']); // change if your route is different
  }
   sendMessage() {
    if (this.name && this.email && this.message) {
      this.successMessage = "Message sent successfully!";
      
      // clear form
      this.name = '';
      this.email = '';
      this.message = '';
    }
  }
}
