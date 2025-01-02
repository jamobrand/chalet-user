export interface AddOn {
    id: string;
    uniqueId: string;
    name: string;
    description: string;
    price: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ApiAddonResponse {
    message: string;
    addons: AddOn[];
  }
  
  interface Customer {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    nationality: string;
    nationalIdNumber: string;
  }

  export interface ReservationData {
    customerId: null;
    chaletId: string;
    checkIn: string;
    checkOut: string;
    selectedDates: string[];
    adults: number;
    children: number;
    totalCost: number;
    status: string;
    paymentStatus: string;
    customer: Customer;
    addons: {
      addonId: string;
      quantity: number;
    }[];
    payment: {
      amount: number;
      paymentMethod: string;
      transactionId: string;
      status: string;
    };
  }