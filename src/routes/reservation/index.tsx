import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Check,
  Calendar,
  Users,
  Download,
  Share2,
  Mail,
  Phone,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import html2pdf from 'html2pdf.js';
import { QRCodeSVG } from 'qrcode.react';
import { LocationState } from './reserve-types';
import { Button } from '@/components/ui/button';

const BookedConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = (location.state as LocationState)?.reservation?.data;

  if (!reservationData) {
    navigate('/search');
    return null;
  }

  const generatePDF = () => {
    const element = document.getElementById('booking-confirmation');
    const opt = {
      margin: 1,
      filename: `booking-${reservationData.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };

  const getQRCodeData = () => {
    return JSON.stringify({
      bookingId: reservationData.id,
      chaletName: reservationData.chalet.name,
      checkIn: reservationData.checkIn,
      checkOut: reservationData.checkOut,
      guestName: `${reservationData.customer.firstName} ${reservationData.customer.lastName}`,
    });
  };

  const shareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Confirmation',
          text: `Booking confirmation for ${reservationData.chalet.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4" id="booking-confirmation">
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center border-b border-gray-200">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Booking Confirmed!</CardTitle>
            <p className="text-gray-600 mt-2">Booking Reference: {reservationData.id}</p>
            <div className="flex justify-center space-x-4 mt-4">
              <Button variant="outline" onClick={generatePDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={shareBooking}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{reservationData.chalet.name}</h3>
              <p className="text-gray-600">{reservationData.chalet.type}</p>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {reservationData.chalet.address}
              </div>
              {/* <p className="text-sm text-gray-600">{reservationData.chalet.description}</p> */}
            </div>

            <Separator />

            {/* Stay Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-medium">{format(new Date(reservationData.checkIn), 'PPP')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-medium">{format(new Date(reservationData.checkOut), 'PPP')}</p>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-4">
              <h4 className="font-semibold">Guest Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <Users className="w-4 h-4 inline mr-2" />
                    {reservationData.numberOfAdults} Adults, {reservationData.numberOfChildren}{' '}
                    Children
                  </p>
                  <p className="text-gray-600">
                    <Mail className="w-4 h-4 inline mr-2" />
                    {reservationData.customer.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <Phone className="w-4 h-4 inline mr-2" />
                    {reservationData.customer.phone}
                  </p>
                  <p className="text-gray-600">
                    Nationality: {reservationData.customer.nationality}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div>
              <h4 className="font-semibold mb-4">Payment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Payment Status</span>
                  <span className="font-medium">
                    {reservationData.payments[0]?.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method</span>
                  <span className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {reservationData.payments[0]?.method.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Amount</span>
                  <span className="font-medium">
                    KES{' '}
                    {Number(reservationData.totalCost).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <Separator />
              {/* QR Code Section */}
              <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div style={{ background: 'white', padding: '16px' }}>
                  <QRCodeSVG value={getQRCodeData()} size={256} level="H" />
                </div>

                <p className="text-sm text-gray-500 text-center mt-2">
                  Scan to view booking details
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help with your booking?{' '}
            <button
              onClick={() =>
                window.open(
                  'https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/hotel-contacts',
                  '_blank',
                )
              }
              className="text-primary-600 hover:underline"
            >
              Contact us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookedConfirmation;
