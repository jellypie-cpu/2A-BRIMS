import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule} from '@angular/common';
import { Subscription} from 'rxjs';
import { AuthService} from '../../../../core/services/auth';
import { ResidentService} from '../../../../core/services/resident';
import { UserService} from '../../../../core/services/user';
import { AppUser} from '../../../../core/models/user.model';
import { Resident} from '../../../../core/models/resident.model';

@Component({
  selector: 'app-my-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-information.html',
  styleUrls: ['./my-information.scss'],
})
export class ProfileMyInformation
implements OnInit, OnDestroy {

  user: AppUser | null = null;

  resident: Resident | null = null;

  loading = true;

  private subscription = new Subscription();

  private residentSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private residentService: ResidentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    this.subscription.add(

      this.authService.currentUser$
        .subscribe(user => {

          this.user = user;

          this.residentSubscription?.unsubscribe();

          if (!user?.id) {

            this.loading = false;
            this.resident = null;

            return;
          }

          const residentId =
            user.residentId || user.id;

          this.loading = true;

          this.residentSubscription =
            this.residentService
              .getById(residentId)
              .subscribe({

                next: resident => {

                  this.resident = resident || null;

                  this.loading = false;
                },

                error: () => {

                  this.loading = false;

                  this.resident = null;
                }
              });
        })
    );
  }

  async onProfileImageSelected(event: any): Promise<void> {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Invalid image file.');
    return;
  }

  if (file.size > 500 * 1024) {
    alert('Image must be below 500KB.');
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    if (!this.user?.id) return;

    const base64 = reader.result as string;

    await this.userService.saveProfileImageAsBase64(
      this.user.id,
      base64
    );

    const residentId = this.user.residentId || this.user.id;

    await this.residentService.update(residentId, {
      photo: base64
    });

    alert('Profile image updated.');
  };

  reader.readAsDataURL(file);
}

  ngOnDestroy(): void {

    this.subscription.unsubscribe();

    this.residentSubscription?.unsubscribe();
  }
}