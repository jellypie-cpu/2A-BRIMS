import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  message = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    let user: User | null = null;

    //  Saample users
    if (this.email === 'maniscan@brims.com' && this.password === '1234') {
      user = { username: 'Jelly Quen', role: 'admin' };
    } else if (this.email === 'staff@brims.com' && this.password === '1234') {
      user = { username: 'Staff Member', role: 'staff' };
    } else if (this.email === 'resident@brims.com' && this.password === '1234') {
      user = { username: 'Resident', role: 'resident' };
    }

    if (user) {
      this.authService.login(user);
      this.message = `Login successful! Role: ${user.role}`;
      this.router.navigate(['/dashboard']);
    } else {
      this.message = 'Invalid credentials!';
    }
  }
}
