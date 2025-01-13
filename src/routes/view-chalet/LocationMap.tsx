import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Location {
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  address: string;
}

interface LocationMapProps {
  location: Location;
}

const LocationMap = ({ location }: LocationMapProps) => {
  const { coordinates, locationName, address } = location;

  useEffect(() => {
    // Create map instance
    const map = L.map('map').setView([coordinates.lat, coordinates.lng], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Create custom marker icon
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41], // Default size
      iconAnchor: [12.5, 41], // Center bottom anchor
      popupAnchor: [0, -41], // Popup offset
    });
    

    // Add marker with popup
    L.marker([coordinates.lat, coordinates.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(locationName)
      .openPopup();

    // Cleanup function
    return () => {
      map.remove();
    };
  }, [coordinates, locationName]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Where you'll be</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{address}</p>
        <div
          id="map"
          className="w-full h-96 rounded-lg border border-gray-200"
          style={{ zIndex: 0 }} // Ensure proper stacking context
        />
      </CardContent>
    </Card>
  );
};

export default LocationMap;
