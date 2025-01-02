import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config';
import { Chalet } from '../chalet-display-types';
import { ImageSlider } from './image-slider';
import { Link } from 'react-router-dom';
import { BedDouble, Users } from 'lucide-react';
import { calculateTotalCapacity, formatAvailabilityDate } from './types';

interface ApiResponse {
  message: string;
  chalets: Chalet[];
}

const ChaletSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-w-16 aspect-h-9 rounded-xl bg-gray-200 mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="flex space-x-2">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const ChaletDisplay = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chaletsHomes'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`${API_URL}/v1/chalets/home/chalets`);
      return response.data.chalets;
    },
  });

  if (error) return (
    <div className="text-center py-10 text-red-600">
      Error loading chalets
    </div>
  );

  return (
    <div className="bg-white mt-60 sm:mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Our chalets</h2>
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Show all
          </button>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {isLoading ? (
            <>
              <ChaletSkeleton />
              <ChaletSkeleton />
              <ChaletSkeleton />
              <ChaletSkeleton />
            </>
          ) : !data || data.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-600">No chalets available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Please check back soon for new listings.</p>
            </div>
          ) : (
            data.map((chalet) => (
              <div key={chalet.id} className="group">
                <div className="relative">
                  <ImageSlider images={chalet.images} />

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link
                            to={`/chalets/${chalet.id}`}
                            className="hover:text-[#27534c] hover:underline"
                          >
                            {chalet.name}
                          </Link>
                        </h3>
                        <div className="text-sm text-gray-500">{chalet.locationName}</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{calculateTotalCapacity(chalet.rooms)} guests</span>
                        <BedDouble className="w-4 h-4 ml-2" />
                        <span>{chalet.roomCount} rooms</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {chalet.amenities.map((amenity) => (
                          <span
                            key={amenity.id}
                            className="inline-block bg-gray-100 px-2 py-1 rounded-md text-xs"
                          >
                            {amenity.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                      <div>
                        <span className="text-lg font-semibold">
                          KES {parseInt(chalet.basePrice).toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm"> / night</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatAvailabilityDate(chalet.ChaletUnavailableDates)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChaletDisplay;