import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  message = '';

login() {
    if (this.email === 'maniscan@brims.com' && this.password === '1234' && this.role === 'admin') {
      this.message = 'Login successful!';
    } else {
      this.message = 'Invalid email or password';
    }
  }
}
