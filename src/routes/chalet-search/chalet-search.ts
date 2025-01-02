export interface Chalet {
    id: string;
    name: string;
    type: string;
    basePrice: string; // Note: Changed to string as that's how it comes from API
    locationName: string;
    isUnderMaintenance: boolean;
    roomCount: number;
    isEnsuite: boolean;
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
    rooms: {
      roomType: string;
      capacity: number;
    }[];
    _count: {
      rooms: number;
      amenities: number;
      ChaletAvailability: number;
      images: number;
    };
  }

  export  interface Room {
    id: number;
    adults: number;
    children: number;
  }
  
  export  interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export  interface ChaletImage {
    id: string;
    url: string;
    alt: string;
    label: string;
    isMain: boolean;
  }
  
  export  interface ChaletAmenity {
    id: number;
    name: string;
    description: string | null;
  }
  
  export interface ChaletRoom {
    id: string;
    roomType: string;
    capacity: number;
  }
  
export interface ChaletData {
    id: string;
    name: string;
    type: string;
    description: string;
    basePrice: string;
    isEnsuite: boolean;
    roomCount: number;
    locationName: string;
    address: string;
    coordinates: Coordinates;
    rooms: ChaletRoom[];
    amenities: ChaletAmenity[];
    images: ChaletImage[];
    ChaletUnavailableDates: { date: string }[];
  }
  