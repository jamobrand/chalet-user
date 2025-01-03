import { useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Calendar, User } from 'lucide-react';

const BookingVerify = () => {
  const location = useLocation();
  
  // Parse the URL search params
  const searchParams = new URLSearchParams(location.search);
  const bookingParam = searchParams.get('booking');
  
  // Parse the booking data
  const bookingData = bookingParam ? JSON.parse(decodeURIComponent(bookingParam)) : null;
  
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Invalid or missing booking data
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    bookingData.checkIn = bookingData.checkin.replace('t', 'T').replace('z', 'Z');
  bookingData.checkOut = bookingData.checkout.replace('t', 'T').replace('z', 'Z');
}

// Safely format dates with error handling
const formatDate = (dateString:string) => {
  try {
    return format(parseISO(dateString), 'PPP');
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Invalid Date';
  }
};

const checkInDate = bookingData ? formatDate(bookingData.checkIn) : 'Invalid Date';
const checkOutDate = bookingData ? formatDate(bookingData.checkOut) : 'Invalid Date';
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center border-b border-gray-200">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Booking Verification</CardTitle>
            <p className="text-gray-600 mt-2">Booking ID: {bookingData.id}</p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Property Details */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Property Details</h3>
              <p className="text-gray-600">{bookingData.chaletName}</p>
            </div>

            {/* Stay Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Stay Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{checkInDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{checkOutDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Guest Details</h3>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <p className="text-gray-600">{bookingData.guest}</p>
              </div>
            </div>

            {/* Verification Status */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-green-700 font-medium">Booking Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingVerify;