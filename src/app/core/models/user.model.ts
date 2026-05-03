export type UserRole = 'admin' | 'staff' | 'resident';

export interface AppUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;

  residentId?: string; // For residents, link to their resident profile
}