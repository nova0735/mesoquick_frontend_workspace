export type VehicleType = 'MOTORCYCLE' | 'BICYCLE' | 'CAR';

export interface CourierProfileResponse {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  vehicleType: VehicleType;
  licensePlate: string;
}

export interface UpdateProfileRequest {
  address: string;
  phone: string;
  vehicleType: VehicleType;
  licensePlate: string;
}
