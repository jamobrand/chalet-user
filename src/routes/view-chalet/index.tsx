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
import { LocationMap } from './LocationMap';
import ChaletBookingWidget from './booking-widget';
import { Separator } from '@/components/ui/separator';
import ChaletRules from './house-rules';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading chalet details</div>;
  if (!data) return null;

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="py-6 border-b">
              <p className="text-gray-600 whitespace-pre-line">{data?.description}</p>
            </div>

            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <AmenitiesList amenities={data.amenities} />
            </div>

            <div className="py-6">
              <h2 className="text-xl font-semibold mb-4">Room Information</h2>
              <div className="space-y-2">
                <p>Type: {data.type}</p>
                <p>Room Count: {data.roomCount}</p>
                <p>Capacity: {data.rooms[0]?.capacity || 'N/A'} guests</p>
              </div>
            </div>

            <div className="py-6">
              <div className="mb-4">
                <p className="text-2xl font-semibold">Available Dates for booking</p>
                <p className="text-gray-600">Dates available for booking</p>
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

        <div className="py-4">
          <LocationMap
            location={{
              locationName: data.locationName,
              address: data.address,
              coordinates: data.coordinates,
            }}
          />
        </div>

        <Separator />

        <div className="py-2 mt-4">
          <div className="mb-4">
            <p className="text-xl font-semibold">Chalet Rules</p>
          </div>
          <ChaletRules />
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Bottom Bar */}
          <div className="mt-6 border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-gray-400">
                © {new Date().getFullYear()} Great Rift Valley Lodges. All rights reserved.
              </p>

              {/* Social Links */}
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
