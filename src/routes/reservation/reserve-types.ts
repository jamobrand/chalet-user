interface Coordinates {
    lat: number;
    lng: number;
  }
  
  interface BookingDates {
    id: string;
    date: string;
    bookingId: string;
  }
  
  interface Payment {
    id: string;
    uniqueId: string;
    amount: string;
    status: string;
    method: string;
    transactionId: string;
  }
  
  export interface ReservationData {
    id: string;
    chaletId: string;
    checkIn: string;
    checkOut: string;
    numberOfAdults: number;
    numberOfChildren: number;
    totalGuests: number;
    totalCost: string;
    status: string;
    chalet: {
      id: string;
      name: string;
      type: string;
      description: string;
      basePrice: string;
      locationName: string;
      address: string;
      coordinates: Coordinates;
    };
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      nationality: string;
      passportNumber: string;
    };
    bookingDates: BookingDates[];
    payments: Payment[];
  }
  
  export interface ReservationResponse {
    message: string;
    data: ReservationData;
  }
  
  export interface LocationState {
    reservation: {
        data: ReservationData;
    };
  }