import { useLocation, useNavigate } from 'react-router-dom';
import { differenceInDays, format } from 'date-fns';
import {
  Check,
  Calendar,
  Users,
  Download,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  CheckCircle,
  Share2,
  Clock,
  Home,
  Bed,
  ExternalLink,
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { QRCodeSVG } from 'qrcode.react';
import GRVALLOGO from '../../assets/favicon.ico';
import { useEffect, useState } from 'react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state?.reservation;
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    setShowSuccess(true);
  }, []);

  console.log('BookedConfirmation', location);
  if (!reservationData) {
    navigate('/search');
    return null;
  }

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const element = document.getElementById('booking-confirmation-print');
      if (!element) return;

      // Create a temporary container with fixed dimensions
      const originalElement = element.cloneNode(true);
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Reset all styles that might interfere
      const styles = `
        * { box-sizing: border-box !important; }
        .bg-gradient-to-br, .bg-gradient-to-r { background: #ffffff !important; }
        .shadow-xl, .shadow-lg { box-shadow: none !important; }
        .backdrop-blur-sm { backdrop-filter: none !important; }
        .rounded-3xl, .rounded-2xl, .rounded-xl { border-radius: 8px !important; }
        .print\\:block { display: block !important; }
        .print\\:hidden { display: none !important; }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      tempContainer.appendChild(styleSheet);
      tempContainer.appendChild(originalElement);
      document.body.appendChild(tempContainer);

      // Wait for images to load
      const images = tempContainer.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            // Set a timeout to avoid hanging
            setTimeout(resolve, 2000);
          });
        }),
      );

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `booking-${reservationData.bookingReference}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.95 
        },
        html2canvas: {
          scale: 1,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123, // A4 height
          foreignObjectRendering: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 794,
          windowHeight: 1123
        },
        jsPDF: {
          unit: 'px',
          format: [794, 1123], // A4 in pixels
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(tempContainer).save();
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified booking verification URL that works better on mobile
  const getBookingVerificationUrl = () => {
    const baseUrl = window.location.origin;
    
    // Use a simpler approach with URL parameters instead of Base64 encoding
    const params = new URLSearchParams({
      ref: reservationData.bookingReference,
      id: reservationData.id,
      guest: `${reservationData.customer.firstName}_${reservationData.customer.lastName}`,
      checkin: reservationData.checkIn,
      checkout: reservationData.checkOut,
      chalet: reservationData.chalet.name.replace(/\s+/g, '_')
    });

    return `${baseUrl}/booking-verify?${params.toString()}`;
  };

  const shareBooking = async () => {
    const bookingUrl = getBookingVerificationUrl();
    const shareData = {
      title: 'Booking Confirmation',
      text: `Booking confirmed for ${reservationData.chalet.name} - Reference: ${reservationData.bookingReference}`,
      url: bookingUrl,
    };

    // Check if Web Share API is supported and the data can be shared
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        console.error('Error sharing:', error);
        // Fall through to clipboard fallback
      }
    }
    
    // Fallback to clipboard
    fallbackToClipboard();
  };

  const fallbackToClipboard = async () => {
    const bookingUrl = getBookingVerificationUrl();
    
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(bookingUrl);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
        return;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
    
    // Final fallback for older browsers or insecure contexts
    try {
      const textArea = document.createElement('textarea');
      textArea.value = bookingUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    } catch (error) {
      console.error('All clipboard methods failed:', error);
      // Show the URL in a prompt as final resort
      prompt('Copy this booking link:', bookingUrl);
    }
  };

  const checkInDate = new Date(reservationData.checkIn);
  const checkOutDate = new Date(reservationData.checkOut);
  const numberOfNights = differenceInDays(checkOutDate, checkInDate);
  const totalAmount = Number(reservationData.totalCost);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-500">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-700 delay-200">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600">Your reservation has been successfully processed</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Success Notification */}
      {showCopySuccess && (
        <div className="fixed top-4 right-4 z-40 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Booking link copied to clipboard!
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Add logo to main page */}
          <div className="flex items-center justify-center mb-4">
            <img
              src={GRVALLOGO}
              alt="Great Rift Valley Lodge & Golf Resort"
              className="w-16 h-16 object-contain mr-3"
              crossOrigin="anonymous"
            />
            <div className="text-left">
              <h2 className="text-lg font-semibold text-gray-900">Great Rift Valley Lodge</h2>
              <p className="text-sm text-gray-600">& Golf Resort</p>
            </div>
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed</h1>
          <p className="text-xl text-gray-600 mb-1">
            Reference: {reservationData.bookingReference}
          </p>
          <p className="text-sm text-gray-500">Confirmation ID: {reservationData.id}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button
              onClick={generatePDF}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={shareBooking}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          id="booking-confirmation-print"
          className="bg-white rounded-3xl shadow-xl overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* PDF Header with Logo - Only visible in PDF */}
          <div className="print:block hidden bg-white p-6 border-b border-gray-200 page-break-inside-avoid">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={GRVALLOGO}
                  alt="Great Rift Valley Lodge & Golf Resort"
                  className="w-16 h-16 object-contain"
                  crossOrigin="anonymous"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Great Rift Valley Lodge & Golf Resort
                  </h1>
                  <p className="text-gray-600">Booking Confirmation</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Generated on:</p>
                <p className="font-medium">{format(new Date(), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Property Hero */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white print:bg-gray-100 print:text-black page-break-inside-avoid">
            <div className="absolute inset-0 bg-black/10 print:hidden"></div>
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{reservationData.chalet.name}</h2>
                  <p className="text-blue-100 print:text-gray-600 mb-1">{reservationData.chalet.propertyType}</p>
                  <div className="flex items-center text-blue-100 print:text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {reservationData.chalet.address}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</div>
                  <div className="text-blue-100 print:text-gray-600">
                    {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 print:space-y-6">
            {/* Stay Details */}
            <div className="grid md:grid-cols-3 gap-6 print:gap-4 page-break-inside-avoid">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl print:border print:border-gray-300">
                <div className="flex-shrink-0">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Check-in
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {format(checkInDate, 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">{format(checkInDate, 'EEEE')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl print:border print:border-gray-300">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Duration
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {numberOfNights} Night{numberOfNights > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">{format(checkOutDate, 'MMM dd')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl print:border print:border-gray-300">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Guests
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {reservationData.totalGuests} Guest{reservationData.totalGuests > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reservationData.numberOfAdults} Adult
                    {reservationData.numberOfAdults > 1 ? 's' : ''},{' '}
                    {reservationData.numberOfChildren} Child
                    {reservationData.numberOfChildren !== 1 ? 'ren' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 print:bg-gray-50 print:border print:border-gray-300 rounded-2xl p-6 page-break-inside-avoid">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Home className="w-6 h-6 mr-2 text-blue-600" />
                Property Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Bed className="w-4 h-4 mr-2" />
                    Sleeps up to {reservationData.chalet.totalSleeps}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Home className="w-4 h-4 mr-2" />
                    {reservationData.chalet.propertyType}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-700">
                    Base Price: KES {Number(reservationData.chalet.basePrice).toLocaleString()}
                  </div>
                  <div className="text-gray-700">
                    Location: {reservationData.chalet.locationName}
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 print:bg-gray-50 print:border print:border-gray-300 rounded-2xl p-6 page-break-inside-avoid">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Guest Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-purple-600" />
                    <span className="font-medium">
                      {reservationData.customer.firstName} {reservationData.customer.lastName}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-purple-600" />
                    {reservationData.customer.email}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3 text-purple-600" />
                    {reservationData.customer.phone}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="w-5 h-5 mr-3 text-purple-600 font-bold text-sm">ID</span>
                    {reservationData.customer.nationality} -{' '}
                    {reservationData.customer.passportNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 print:bg-gray-50 print:border print:border-gray-300 rounded-2xl p-6 page-break-inside-avoid">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                Payment Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-green-200 print:border-gray-300">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-semibold text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {reservationData.payments[0]?.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200 print:border-gray-300">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">
                    {reservationData.payments[0]?.method.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200 print:border-gray-300">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">
                    {reservationData.payments[0]?.transactionId}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 pt-4">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600 print:text-black">
                    KES {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="text-center py-8 page-break-inside-avoid">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Digital Verification</h3>
              <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200">
                <div className="qr-code-container">
                  <QRCodeSVG
                    value={getBookingVerificationUrl()}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4 max-w-xs">
                  Scan this QR code to verify your booking from any device
                </p>
                <div className="print:block hidden mt-2 text-xs text-gray-400 break-all">
                  {getBookingVerificationUrl()}
                </div>
                <button
                  onClick={() => window.open(getBookingVerificationUrl(), '_blank')}
                  className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium print:hidden"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open verification link
                </button>
              </div>
            </div>

            {/* PDF Footer with Logo */}
            <div className="print:block hidden border-t border-gray-200 pt-6 mt-8">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <img
                    src={GRVALLOGO}
                    alt="GRVAL Logo"
                    className="w-6 h-6 object-contain"
                    crossOrigin="anonymous"
                  />
                  <span>Great Rift Valley Lodge & Golf Resort</span>
                </div>
                <span>Booking Reference: {reservationData.bookingReference}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Help Section */}
        <div className="text-center mt-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl print:hidden">
          <p className="text-gray-600 mb-4">Need assistance with your booking?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() =>
                window.open(
                  'https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/hotel-contacts',
                  '_blank',
                )
              }
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact Resort
            </button>
            <button
              onClick={() =>
                window.open(
                  `mailto:support@example.com?subject=Booking ${reservationData.bookingReference}`,
                  '_blank',
                )
              }
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;