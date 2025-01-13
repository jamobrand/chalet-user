export interface Chalet {
    id: string;
    name: string;
    type: string;
    basePrice: string; // Note: Changed to string as that's how it comes from API
    locationName: string;
    address: string;
    coordinates:Coordinates;
    isUnderMaintenance: boolean;
    roomCount: number;
    isEnsuite: boolean;
    description:string;
    images: {
      id: string;
      url: string;
      isMain: boolean;
      label: string;
    }[];
    amenities: {
      id: number;
      name: string;
    }[];
    ChaletUnavailableDates:UnavailableDate[];
    availabilityCalendar:AvailableData[];
    bookings: Booking[];
    rooms: {
      roomType: string;
      capacity: number;
      chaletId: string;
      room:number;
    }[];
    _count: {
      rooms: number;
      amenities: number;
      ChaletAvailability: number;
      images: number;
    };
  }

  interface AvailableData {
    date:string;
    isAvailable: boolean;
  }

  export interface Amenity {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
  }

  export  interface UnavailableDate {
    id: string;
    chaletId: string;
    date: string;
  }

  export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export interface Location {
    locationName: string;
    address: string;
    coordinates: Coordinates;
  }

  export  interface Booking {
    // Add booking type properties as needed
    startDate: string;
    endDate: string;
  }
