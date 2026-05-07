import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {

  email = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async login() {

  const email = this.email.trim();
  const password = this.password.trim();

  try {

    const user = await this.authService.login(email, password);

    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: `Welcome ${user.username}`,
      timer: 2000,
      showConfirmButton: false
    });

    this.router.navigate(['/dashboard']);

  } catch (error: any) {

    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.message
    });

  }
}

refreshPage() {
  window.location.reload();
}
}