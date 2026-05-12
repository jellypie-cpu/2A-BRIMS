export type DocumentRequestType =
  | 'Barangay Clearance'
  | 'Barangay Indigency'
  | 'Barangay Permit'
  | 'Certificate of Residency';

export type DocumentRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'released';

export interface DocumentRequest {
  id?: string;
  residentId: string;
  residentName?: string;
  residentEmail?: string;
  type: DocumentRequestType;
  status: DocumentRequestStatus;
  createdAt?: any;
  updatedAt?: any;
}