import { useEffect, useRef } from 'react';
import { Location } from './view-chalet-types';
import { GOOGLE_API_KEY } from '@/config';

interface LocationMapProps {
  location: Location;
}

declare global {
  interface Window {
    google: any;
  }
}

export const LocationMap = ({ location }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { coordinates, locationName, address } = location;

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [coordinates]);

  const initMap = () => {
    if (mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: coordinates,
        map,
        title: locationName,
      });
    }
  };

  return (
    <div className="mt-6">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Where you'll be</h3>
        <p className="text-gray-600 mb-4">{address}</p>
        <div 
          ref={mapRef} 
          className="w-full h-[400px] rounded-lg"
        />
      </div>
    </div>
  );
};