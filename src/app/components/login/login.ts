import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { AppUser } from '../../core/models/user.model';

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
    private authService: AuthService,
    private userService: UserService
  ) {}

  login() {
     const email = this.email.trim();// trim to remove spaces
    const password = this.password.trim(); // also this trim too
    const user = this.userService.findByEmail(email);

    console.log('ALL USERS:', this.userService.getUsers());
    console.log('Trying login:', email);
    console.log('Users:', this.userService.getUsers());
    console.log('Found:', user);

    if (user && user.password === password) {
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
        text: 'Invalid email or password!',
      });
    }
  }

  refreshPage() {
    window.location.reload();
  }
}