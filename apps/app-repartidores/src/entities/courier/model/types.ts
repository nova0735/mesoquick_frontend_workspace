export type CourierStatus = 'AVAILABLE' | 'INACTIVE' | 'SUSPENDED';

export interface CourierProfile {
  id: string;
  firstName: string;
  lastName: string;
  cui: string;
  nit: string;
  phone: string;
  email: string;
  status: CourierStatus;
  vehicle: {
    type: 'MOTORCYCLE' | 'CAR' | 'BICYCLE';
    plate: string;
  };
  bankAccount: {
    bankName: string;
    accountType: 'MONETARY' | 'SAVINGS';
    accountNumber: string;
  };
}
