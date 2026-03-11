export interface IUmrahInquiry {
  name: string;
  email: string;
  phone?: string;
  reachBy: 'WhatsApp' | 'Phone Call' | 'Email';
  question?: string;
  topics?: string[];
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt?: Date;
  updatedAt?: Date;
}