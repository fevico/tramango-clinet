export interface TravelPackage {
  _id: string;
  title: string;
  description: string;
  availableSlots: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  packageId: string;
  bookingDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookPackageResponse {
  message: string;
  booking: Booking;
  package: TravelPackage;
}

export interface CreatePackageRequest {
  title: string;
  description: string;
  availableSlots: number;
  price: number;
}
