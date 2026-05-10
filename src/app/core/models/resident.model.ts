export interface Resident {

  id?: string;

  fullname: string;
  birthdate: string;
  civilStatus: string;
  gender: string;
  isVoter: boolean;

  isArchived?: boolean;

  // CHANGE: Storage removed → base64 stored in Firestore
  photo?: string | null;

  createdAt?: any;

  address: {
    zone: string; // CHANGE: forced string consistency
    street: string;
    barangay: string;
  };
}