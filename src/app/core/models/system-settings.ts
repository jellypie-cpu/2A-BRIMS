export interface SystemSettings {
  id?: string;

  barangayName: string;
  municipality: string;
  province: string;

  allowRegistration: boolean;
  maintenanceMode: boolean;

  updatedAt?: any;
}