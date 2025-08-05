// components/PaymentError.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

const PaymentError = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get error details from URL params
  const searchParams = new URLSearchParams(location.search);
  const errorMessage = searchParams.get('message') || 'An error occurred during payment processing';
  const errorCode = searchParams.get('code');
  const reservationRef = searchParams.get('ref');

  // Clean up any stored reservation reference
  useEffect(() => {
    const storedRef = localStorage.getItem('currentReservationRef');
    if (storedRef) {
      localStorage.removeItem('currentReservationRef');
    }
  }, []);

  const handleRetryPayment = () => {
    // Navigate back to booking confirmation with stored data
    // You might want to store the booking details in sessionStorage
    const bookingData = sessionStorage.getItem('pendingBooking');
    if (bookingData) {
      navigate('/reservation/confirm', { 
        state: JSON.parse(bookingData) 
      });
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 mb-6 text-lg">
            {errorMessage}
          </p>

          {errorCode && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600">
                Error Code: <span className="font-mono">{errorCode}</span>
              </p>
              {reservationRef && (
                <p className="text-sm text-red-600 mt-1">
                  Reference: <span className="font-mono">{reservationRef}</span>
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Your payment could not be processed. Please try again or use a different payment method.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </button>
              
              <button
                onClick={handleRetryPayment}
                className="flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center px-6 py-3 bg-[#27534c] text-white rounded-lg hover:bg-[#1c3d38] transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Return Home
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Still having issues? Contact our support team at{' '}
            <a href="mailto:support@yourcompany.com" className="text-[#27534c] hover:underline">
              support@yourcompany.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;