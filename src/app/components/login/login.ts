import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth';
import Swal from 'sweetalert2';

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

    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: `Welcome, ${user.username}! Role: ${user.role}`,
      timer: 2000,
      showConfirmButton: false,
    });

    this.router.navigate(['/dashboard']);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Invalid credentials!',
    });
  }
  }
}