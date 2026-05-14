export interface Blotter {
  id?: string;

  complaint: string;
  victims: string;
  respondent: string;

  type: 'Civil' | 'Criminal' | '';

  location: string;
  date: string;
  time: string;

  status: 'Active' | 'Settled' | 'Scheduled';

  description?: string;
  residentName?: string;
  barangay?: string;

  isArchived?: boolean;

  createdAt?: any;
  updatedAt?: any;
  archivedAt?: any;
}