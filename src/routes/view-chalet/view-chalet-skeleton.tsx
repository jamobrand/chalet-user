import Header from '../homepage/navbar';
import { Skeleton } from '@/components/ui/skeleton';

const ViewChaletDetailsSkeleton = () => {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/3" />
        </div>

        {/* Image Gallery Skeleton */}
        <div className="relative mb-8">
          {/* Mobile View */}
          <div className="lg:hidden">
            <Skeleton className="w-full h-[300px] rounded-lg" />
          </div>

          {/* Desktop View */}
          <div className="hidden lg:grid grid-cols-4 gap-2">
            <div className="col-span-2">
              <Skeleton className="w-full h-[400px] rounded-l-xl" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((index) => (
                <Skeleton
                  key={index}
                  className={`w-full h-[198px] ${
                    index === 2 ? 'rounded-tr-xl' : index === 4 ? 'rounded-br-xl' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Description Skeleton */}
            <div className="py-6 border-b">
              <div className="space-y-2">
                {[1, 2, 3].map((index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
              </div>
            </div>

            {/* Amenities Skeleton */}
            <div className="py-6 border-b">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Room Information Skeleton */}
            <div className="py-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((index) => (
                  <Skeleton key={index} className="h-4 w-32" />
                ))}
              </div>
            </div>

            {/* Calendar Skeleton */}
            <div className="py-6">
              <Skeleton className="h-8 w-64 mb-4" />
              <div className="hidden md:grid md:grid-cols-2 gap-8">
                {[1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 42 }).map((_, i) => (
                        <Skeleton key={i} className="w-12 h-12 rounded-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="md:hidden">
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-10 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Widget Skeleton */}
          <div className="lg:col-span-1 mt-9">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Map Skeleton */}
        <div className="py-4">
          <Skeleton className="w-full h-[400px] rounded-lg" />
        </div>

        {/* Rules Skeleton */}
        <div className="py-2 mt-4">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Skeleton className="h-4 w-64 bg-gray-800" />
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <Skeleton key={index} className="w-6 h-6 rounded-full bg-gray-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewChaletDetailsSkeleton;