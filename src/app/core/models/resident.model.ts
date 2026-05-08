export interface Resident {
  id?: string;

  userId?: string;

  fullname: string;

  birthdate: string;

  civilStatus: string;

  gender: string;

  isVoter: boolean;

  photo?: string | null;

  isArchived?: boolean;

  createdAt?: any;

  address: {
    zone: number;
    street: string;
    barangay: string;
  };
}