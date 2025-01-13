import { Helmet } from 'react-helmet-async';
import Header from '../homepage/navbar';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { useParams } from 'react-router-dom';
import { ApiResponse } from './view-chalet-types';
import { ImageGallery } from './image-gallery';
import { AmenitiesList } from './amenities-list';
import { BookingCalendar } from './booking-calendar';
import ChaletBookingWidget from './booking-widget';
import { Separator } from '@/components/ui/separator';
import ChaletRules from './house-rules';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Home,
  Building2,
  Bath,
} from 'lucide-react';
import ViewChaletDetailsSkeleton from './view-chalet-skeleton';
import LocationMap from './LocationMap';

const ViewChaletDetails = () => {
  const params = useParams();
  const chaletId = params.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ['chalet'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/chalets/${chaletId}`);

      return response.data.chalet; // Extract the chalets array from the response
    },
  });

  // if (isLoading) return <div>Loading...</div>;
  if (isLoading) return <ViewChaletDetailsSkeleton />;
  if (error) return <div>Error loading chalet details</div>;
  if (!data) return null;

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  const propertyHighlights = [
    {
      icon: Home,
      label: 'Property Type',
      value: data.propertyType === 'STANDALONE' ? 'DUPLEX_UPPER' : 'DUPLEX_LOWER',
    },
    // {
    //   icon: Users,
    //   label: 'Guests',
    //   value: `${data.totalSleeps} guests maximum`,
    // },
    {
      icon: Building2,
      label: 'Rooms',
      value: `${data.roomCount} bedrooms`,
    },
    {
      icon: Bath,
      label: 'Bathrooms',
      value: `${data.totalWashrooms} bathrooms`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{data?.name}</title>
        <meta name="description" content={data?.description} />
      </Helmet>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">{data.name}</h1>
          <p className="text-gray-600">{data.locationName}</p>
        </div>

        <ImageGallery images={data.images} />

        {/* Property Highlights */}
        <div className="py-8 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyHighlights.map((highlight, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <highlight.icon className="w-8 h-8 mb-2 text-gray-600" />
                <p className="text-lg font-medium">{highlight.value}</p>
                <p className="text-sm text-gray-500">{highlight.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-4">About this space</h2>
              <p className="text-gray-600 whitespace-pre-line">{data?.description}</p>
            </div>

            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <AmenitiesList amenities={data.amenities} />
            </div>

            {/* Room Details */}
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Sleeping arrangements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.rooms.map((room, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Bedroom {index + 1}</h3>
                    <p className="text-gray-600">
                      {room.roomType} room with {room.capacity} person capacity
                      {room.hasBunkBed && `, includes bunk bed (${room.bunkBedCapacity} persons)`}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {room.notEnsuite ? 'Shared bathroom' : 'En-suite bathroom'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-6">
              <div className="mb-4">
                <p className="text-2xl font-semibold">Available Dates for booking</p>
                <p className="text-gray-600">Add your travel dates for exact pricing</p>
              </div>
              <BookingCalendar
                unavailableDates={data.ChaletUnavailableDates}
                bookings={data.bookings}
              />
              <div></div>
            </div>
          </div>

          <div className="lg:col-span-1 mt-9">
            <ChaletBookingWidget chalet={data} />
          </div>
        </div>

        <div className="py-4 border-t">
          <LocationMap
            location={{
              locationName: data.locationName,
              address: data.address,
              coordinates: data.coordinates,
            }}
          />
        </div>

        <Separator />

        {/* House Rules */}
        <div className="py-6">
          <h2 className="text-xl font-semibold mb-4">House rules</h2>
          <ChaletRules />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mt-6 border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Great Rift Valley Lodges. All rights reserved.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-emerald-500 transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ViewChaletDetails;
