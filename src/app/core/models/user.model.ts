export type UserRole = 'admin' | 'staff' | 'resident';

export interface AppUser {
  id?: string;

  username: string;
  email: string;

  role: UserRole;

  createdAt?: any;

  residentId?: string;
}