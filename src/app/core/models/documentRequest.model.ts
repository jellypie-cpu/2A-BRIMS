export interface DocumentRequest {
  id: string;
  residentId: string;

  type: 'Barangay Clearance' | 'Certificate of Residency';

  status: 'pending' | 'approved' | 'rejected';

  createdAt: Date;
}