import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { ResidentForm } from './residents-form/residents-form';
import { ResidentService } from '../../../core/services/resident';
import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user';

import { Resident } from '../../../core/models/resident.model';
import { AppUser, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-residents-information',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentForm],
  templateUrl: './residents-information.html',
  styleUrls: ['./residents-information.scss'],
})
export class ResidentsInformation implements OnInit {
  zones = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  selectedZone: string | null = null;
  searchText = '';

  allResidents: Resident[] = [];
  residents: Resident[] = [];
  residentUsers: AppUser[] = [];

  loading = true;
  showForm = false;
  selectedResident: Resident | null = null;
  isEditMode = false;

  constructor(
    private residentService: ResidentService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadResidentUsers();
    this.loadResidents();
  }

  get currentUserRole(): UserRole | '' {
    return this.authService.getUserRole();
  }

  loadResidentUsers(): void {
    this.userService.getResidentUsers().subscribe(users => {
      this.residentUsers = users || [];
    });
  }

  loadResidents(): void {
    this.loading = true;

    this.residentService.getActive().subscribe({
      next: residents => {
        this.allResidents = residents || [];
        this.filterResidents();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Unable to load residents.', 'error');
      }
    });
  }

  filterResidents(): void {
    let filtered = [...this.allResidents];

    if (this.selectedZone !== null) {
      filtered = filtered.filter(
        resident => resident.address?.zone === this.selectedZone
      );
    }

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();

      filtered = filtered.filter(resident =>
        resident.fullname?.toLowerCase().includes(search) ||
        resident.userEmail?.toLowerCase().includes(search) ||
        resident.address?.street?.toLowerCase().includes(search) ||
        resident.address?.barangay?.toLowerCase().includes(search)
      );
    }

    this.residents = filtered;
  }

  addResident(): void {
    this.selectedResident = null;
    this.isEditMode = true;
    this.showForm = true;
  }

  openResident(resident: Resident): void {
    this.selectedResident = structuredClone(resident);
    this.isEditMode = false;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedResident = null;
  }

  async saveResident(resident: Resident): Promise<void> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?.id) {
      Swal.fire('Authentication Error', 'No logged in user detected.', 'error');
      return;
    }

    const duplicate = this.allResidents.some(existingResident =>
      existingResident.id !== resident.id &&
      existingResident.fullname.trim().toLowerCase() === resident.fullname.trim().toLowerCase() &&
      existingResident.birthdate === resident.birthdate
    );

    if (duplicate) {
      Swal.fire('Duplicate Resident', 'Resident already exists.', 'warning');
      return;
    }

    const payload: Resident = {
      ...resident,
      userId: resident.userId || '',
      userEmail: resident.userEmail || '',
      isArchived: resident.isArchived ?? false,
      createdBy: resident.createdBy || currentUser.id,
      createdByName: resident.createdByName || currentUser.username,
      updatedBy: currentUser.id,
      address: {
        zone: String(resident.address.zone),
        street: resident.address.street,
        barangay: resident.address.barangay
      }
    };

    await this.residentService.saveResident(payload);

    Swal.fire('Saved', 'Resident information saved successfully.', 'success');
    this.closeForm();
  }

  private getRoleOptionsHtml(): string {
    const options: { label: string; value: UserRole }[] = [
      { label: 'Resident', value: 'resident' },
      { label: 'Staff', value: 'staff' }
    ];

    if (this.currentUserRole === 'admin') {
      options.push({ label: 'Admin', value: 'admin' });
    }

    return options
      .map(option => `<option value="${option.value}">${option.label}</option>`)
      .join('');
  }

  private canCreateRole(role: UserRole): boolean {
    if (this.currentUserRole === 'admin') {
      return true;
    }

    if (this.currentUserRole === 'staff') {
      return role === 'resident' || role === 'staff';
    }

    return false;
  }

  async createAppUserForResident(resident: Resident): Promise<void> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?.id) {
      Swal.fire('Authentication Error', 'No logged in user detected.', 'error');
      return;
    }

    if (this.currentUserRole !== 'admin' && this.currentUserRole !== 'staff') {
      Swal.fire('Access Denied', 'Only admin or staff can create app user accounts.', 'error');
      return;
    }

    if (!resident.id) {
      Swal.fire('Error', 'Resident ID is missing.', 'error');
      return;
    }

    if (resident.userId) {
      Swal.fire('Already Linked', 'This resident already has an app user account.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Create App User',
      html: `
        <input
          id="app-email"
          class="swal2-input"
          placeholder="Email"
          type="email"
        >

        <input
          id="app-password"
          class="swal2-input"
          placeholder="Password"
          type="password"
        >

        <select id="app-role" class="swal2-input">
          ${this.getRoleOptionsHtml()}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Account',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const emailInput = document.getElementById('app-email') as HTMLInputElement;
        const passwordInput = document.getElementById('app-password') as HTMLInputElement;
        const roleSelect = document.getElementById('app-role') as HTMLSelectElement;

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const role = roleSelect.value as UserRole;

        if (!email || !password || !role) {
          Swal.showValidationMessage('Email, password, and role are required.');
          return false;
        }

        if (password.length < 6) {
          Swal.showValidationMessage('Password must be at least 6 characters.');
          return false;
        }

        if (!this.canCreateRole(role)) {
          Swal.showValidationMessage('Staff cannot create an admin account.');
          return false;
        }

        return { email, password, role };
      }
    });

    if (!result.isConfirmed || !result.value) return;

    try {
      const { email, password, role } = result.value as {
        email: string;
        password: string;
        role: UserRole;
      };

      if (!this.canCreateRole(role)) {
        Swal.fire('Access Denied', 'Staff cannot create an admin account.', 'error');
        return;
      }

      const credential = await this.authService.createAuthAccount(email, password);
      const authUser = credential.user;

      await this.userService.addUser({
        id: authUser.uid,
        username: resident.fullname,
        email,
        role,
        residentId: resident.id
      });

      await this.residentService.update(resident.id, {
        userId: authUser.uid,
        userEmail: email
      });

      Swal.fire('Created', `${role} account created successfully.`, 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Failed to create app user.', 'error');
    }
  }

  async archiveResident(resident: Resident): Promise<void> {
    if (!resident.id) return;

    const result = await Swal.fire({
      title: 'Archive Resident?',
      text: `Move ${resident.fullname} to archive?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Archive',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    await this.residentService.archive(resident.id);

    this.allResidents = this.allResidents.filter(
      existingResident => existingResident.id !== resident.id
    );

    this.filterResidents();

    Swal.fire('Archived', 'Resident moved to archive.', 'success');
  }
}