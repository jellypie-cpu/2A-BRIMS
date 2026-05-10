export interface Resident {
  id?: string;
  fullname: string;
  email?: string;
  birthdate: string;
  civilStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  gender: 'Male' | 'Female' | 'Other';
  isVoter: boolean;
  isArchived?: boolean;
  photo?: string | null;
  createdAt?: any;
  updatedAt?: any;
  userId?: string;
  address: {
    zone: string;
    street: string;
    barangay: string;
  };
}

export interface ResidentSearchCriteria {
  fullname?: string;
  zone?: string;
  civilStatus?: string;
  isArchived?: boolean;
}
