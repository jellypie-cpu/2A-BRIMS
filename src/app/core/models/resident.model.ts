export interface Resident {
  id?: string;
  userId?: string | null;

  fullname: string;
  birthdate: string;
  civilStatus: string;
  gender: string;
  isVoter: boolean;
  isArchived?: boolean;

  // Firestore-only photo storage.
  // No Firebase Storage bucket is used.
  photo?: string | null;

  address: {
    zone: string;
    street: string;
    barangay: string;
  };

  createdAt?: any;
  updatedAt?: any;
}