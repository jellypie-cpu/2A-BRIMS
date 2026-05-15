export interface Resident {
  id?: string;

  residentNumber?: string;

  userId: string;
  userEmail: string;

  firstname: string;
  middlename?: string;
  lastname: string;
  fullname: string;

  birthdate: string;
  civilStatus: string;
  gender: string;
  contactNumber?: string;

  isVoter: boolean;
  isArchived: boolean;

  photo?: string | null;

  address: {
    zone: string;
    street: string;
    barangay: string;
  };

  createdBy?: string | null;
  createdByName?: string | null;
  updatedBy?: string | null;

  createdAt?: any;
  updatedAt?: any;
  archivedAt?: any;
  restoredAt?: any;
}