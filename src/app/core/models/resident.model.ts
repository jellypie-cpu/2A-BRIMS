export interface Resident {
  id?: string;

  // This MUST be the same as the user document id.
  userId: string;
  userEmail: string;

  fullname: string;
  birthdate: string;
  civilStatus: string;
  gender: string;
  contactNumber?: string;

  isVoter: boolean;
  isArchived: boolean;

  // Firestore-only image storage.
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