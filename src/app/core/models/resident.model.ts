export interface Resident {
  id?: string;

  fullname: string;
  birthdate: string;
  civilStatus: string;
  gender: string;
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
}