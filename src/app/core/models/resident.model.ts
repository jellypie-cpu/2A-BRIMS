export interface Resident {
  id: string;
  userId?: string; // LINK TO USER

  fullname: string;
  birthdate: string;
  civilStatus: string;
  gender: string;

  isVoter: boolean;

  address: {
    zone: number;
    street: string;
    barangay: string;
  };
}