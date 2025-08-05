// components/PaymentCancelled.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Home } from 'lucide-react';

const PaymentCancelled = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get message from URL params
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get('message') || 'Payment was cancelled';

  // Clean up any stored reservation reference
  useEffect(() => {
    const storedRef = localStorage.getItem('currentReservationRef');
    if (storedRef) {
      localStorage.removeItem('currentReservationRef');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>

          <p className="text-gray-600 mb-8 text-lg">{message}</p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Your reservation was not created. You can try booking again or contact support if you
              need assistance.
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
            Need help? Contact our support team at{' '}
            <a href="mailto:support@yourcompany.com" className="text-[#27534c] hover:underline">
              support@yourcompany.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
