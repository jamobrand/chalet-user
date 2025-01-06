import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Users,
  Calendar,
  Home,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Tv,
  Bath,
  Map,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchChalets } from './feature/use-search-chalets';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChaletData, ChaletImage, Room } from './chalet-search';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const AmenityIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Wi-Fi':
      return <Wifi className="h-4 w-4" />;
    case 'TV with DSTV':
      return <Tv className="h-4 w-4" />;
    case 'En-suite Bathrooms':
      return <Bath className="h-4 w-4" />;
    default:
      return null;
  }
};

const ImageSlider = ({ images }: { images: ChaletImage[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full sm:w-96 h-64 group">
      <img
        src={images[currentImageIndex].url}
        alt={images[currentImageIndex].alt}
        className="object-cover w-full h-full rounded-l-lg"
      />
      <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          type='button'
          size="icon"
          className="bg-black/50 hover:bg-black/70"
          onClick={prevImage}
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          type='button'
          className="bg-black/50 hover:bg-black/70"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </Button>
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-all',
              index === currentImageIndex ? 'bg-white w-3' : 'bg-white/50',
            )}
          />
        ))}
      </div>
    </div>
  );
};

const ChaletCard = ({
  chalet,
}: {
  chalet: ChaletData;
}) => {
  const navigate = useNavigate();
  const totalCapacity = chalet.rooms.reduce((sum, room) => sum + room.capacity, 0);
  const mainAmenities = chalet.amenities.slice(0, 4);

   const handleSelect = (chalet: ChaletData) => {
    navigate(`/chalets/${chalet.id}`)
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
      onClick={() => handleSelect(chalet)}
    >
      <div className="flex flex-col sm:flex-row">
        <ImageSlider images={chalet.images} />
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl text-[#27534c] font-semibold">{chalet.name}</h2>
                <Badge variant="outline" className="ml-2">
                  {chalet.type}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Up to {totalCapacity} guests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{chalet.roomCount} rooms</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Map className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{chalet.locationName}</span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{chalet.description}</p>

              <div className="flex flex-wrap gap-3 mb-4">
                {mainAmenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded"
                  >
                    <AmenityIcon name={amenity.name} />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-end pt-4 border-t">
              <div>
                <div className="text-2xl font-semibold">
                  KES{' '}
                  {Number(chalet.basePrice).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-sm text-gray-500">per night</div>
              </div>
              <Button className="min-w-[120px] bg-[#27534c] hover:bg-[#1c3d38]">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ChaletSearchResults = () => {
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()

  // Parse dates
  const checkIn = new Date(searchParams.get('checkIn') || '');
  const checkOut = new Date(searchParams.get('checkOut') || '');

  // Parse rooms data
  const roomsData = searchParams.get('rooms');
  const rooms: Room[] = roomsData ? JSON.parse(roomsData) : [];

  // Calculate totals
  const totalGuests = rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  const totalRooms = rooms.length;

  // Function to get room summary text
  const getRoomSummary = (room: Room, index: number) => {
    return `Room ${index + 1}: ${room.adults} ${room.adults === 1 ? 'adult' : 'adults'}${
      room.children ? ` & ${room.children} ${room.children === 1 ? 'child' : 'children'}` : ''
    }`;
  };

  const { data: chalets, isLoading } = useSearchChalets({
    checkIn: new Date(searchParams.get('checkIn') || ''),
    checkOut: new Date(searchParams.get('checkOut') || ''),
    rooms: rooms,
  });

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Available Chalets</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-2 mt-14 sm:px-4 lg:px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col space-y-6">
            {/* Location */}
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-gray-500" />
              <span className="font-semibold text-lg">Available Chalets</span>
            </div>

            {/* Dates */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Check in</span>
                  <span className="font-medium">{format(checkIn, 'EEE, MMM d, yyyy')}</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex flex-col mr-8">
                  <span className="text-sm text-gray-500">Check out</span>
                  <span className="font-medium">{format(checkOut, 'EEE, MMM d, yyyy')}</span>
                </div>
              </div>

              {/* Guests & Rooms */}
              <Users className="h-5 w-5 text-gray-500 ml-10" />
              <div className="flex flex-col mr-9">
                <div className="font-medium">
                  {totalRooms} {totalRooms === 1 ? 'Room' : 'Rooms'} · {totalGuests}{' '}
                  {totalGuests === 1 ? 'Guest' : 'Guests'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {rooms.map((room, index) => (
                    <div key={room.id} className="mb-1">
                      {getRoomSummary(room, index)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <Skeleton className="w-full sm:w-96 h-64" />
                  <div className="flex-1 p-6 space-y-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex justify-between items-end">
                      <Skeleton className="h-20 w-1/2" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Hotel Cards */}
        {!isLoading && (
          <div className="space-y-6">
            {chalets.map((chalet: ChaletData) => (
              <ChaletCard key={chalet.id} chalet={chalet} 
              
              // onSelect={handleSelect} 
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ChaletSearchResults;
