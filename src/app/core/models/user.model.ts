export type UserRole =
  | 'admin'
  | 'staff'
  | 'resident';

export interface ActivityLog {
  action: string;
  time: any;
}

export interface AppUser {
  id?: string;

  username: string;
  email: string;
  role: UserRole;
  residentId?: string;
  profileImage?: string;
  activityLogs?: ActivityLog[];
  createdAt?: any;
  updatedAt?: any;
}