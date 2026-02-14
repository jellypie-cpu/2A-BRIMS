import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';

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
role = 'admin';
 constructor(private router: Router) {}

login() {
  
    if (this.email === 'maniscan@brims.com' && this.password === '1234' ) {
      this.message = 'Login successful!';
        this.router.navigate(['/home']);
    } else {
      this.message = 'Invalid credentials!';
    }
  }
}
