import {
    Tv, Bath, Car, Microwave,
  } from "lucide-react";
import { Amenity } from "./view-chalet-types";
  
  const amenityIcons: Record<string, any> = {
    "TV with DSTV": Tv,
    "En-suite Bathrooms": Bath,
    "Parking": Car,
    "Microwave": Microwave,
    // Add more mappings as needed
  };
  
  export const AmenitiesList = ({ amenities }: { amenities: Amenity[] }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((amenity) => {
          const Icon = amenityIcons[amenity.name] || Microwave;
          return (
            <div key={amenity.id} className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    );
  };