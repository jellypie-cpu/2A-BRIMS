import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // <-- add DatePipe

@Component({
  selector: 'app-overview',
  standalone: true, // make sure it's standalone
  imports: [CommonModule, DatePipe], // <-- add DatePipe here
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
})
export class ProfileOverview {
  adminName: string = 'Admin';
  profileImage: string | ArrayBuffer | null = null;

  activityLogs = [
    { time: new Date(), action: 'Logged in' },
    { time: new Date(Date.now() - 1000 * 60 * 5), action: 'Updated Profile Info' },
    { time: new Date(Date.now() - 1000 * 60 * 30), action: 'Logged out' }
  ];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
}