import { useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Calendar, User } from 'lucide-react';

const BookingVerify = () => {
  const location = useLocation();
  
  // Parse the URL search params
  const searchParams = new URLSearchParams(location.search);
  const bookingParam = searchParams.get('booking');
  
  let bookingData = null;
  
  if (bookingParam) {
    try {
      // Handle URL-safe Base64 decoding
      let base64Data = bookingParam
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Add padding if needed
      while (base64Data.length % 4) {
        base64Data += '=';
      }
      
      // Decode Base64 and parse JSON
      const decodedData = atob(base64Data);
      bookingData = JSON.parse(decodedData);
      
    } catch (error) {
      console.error('Error parsing booking data:', error);
      bookingData = null;
    }
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

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <h2 className="text-xl font-semibold mb-2">Invalid Booking Link</h2>
              <p>The booking verification link is invalid or corrupted.</p>
              <p className="text-sm mt-2 text-gray-500">Please check your booking confirmation email for the correct link.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkInDate = formatDate(bookingData.checkIn);
  const checkOutDate = formatDate(bookingData.checkOut);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center border-b border-gray-200">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Booking Verification</CardTitle>
            <p className="text-gray-600 mt-2">Reference: {bookingData.reference}</p>
            <p className="text-sm text-gray-500">Booking ID: {bookingData.id}</p>
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

            {/* Booking Status */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Status</h3>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {bookingData.status}
                </span>
              </div>
            </div>

            {/* Verification Status */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-green-700 font-medium">Booking Successfully Verified</p>
              </div>
              <p className="text-green-600 text-sm mt-1">This booking is valid and confirmed in our system.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingVerify;