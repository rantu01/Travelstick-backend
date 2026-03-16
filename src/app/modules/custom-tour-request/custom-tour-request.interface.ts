export interface ICustomTourRequest {
  selectedDestination?: string;
  customDestination?: string;
  travelDate?: Date;
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  requirements?: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt?: Date;
  updatedAt?: Date;
}
