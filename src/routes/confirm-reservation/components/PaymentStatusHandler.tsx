/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaymentStatusResponse {
  status: 'PENDING' | 'CONFIRMED' | 'NOT_FOUND';
  reservation: any;
}

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  // Get reservation reference from URL params
  const searchParams = new URLSearchParams(location.search);
  const reservationRef = searchParams.get('ref');

  // Query to check reservation status
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reservation-status', reservationRef],
    queryFn: async (): Promise<PaymentStatusResponse> => {
      if (!reservationRef) throw new Error('No reservation reference provided');

      const response = await fetch(`${API_URL}/v1/booking/status/${reservationRef}`);
      if (!response.ok) {
        throw new Error('Failed to check reservation status');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!reservationRef,
    // refetchInterval: (data) => {
    //   // Stop refetching if reservation is confirmed or not found
    //   return data?.status === 'PENDING' ? 3000 : false;
    // },
    refetchIntervalInBackground: true,
  });

  // Auto-verify payment on component mount
  useEffect(() => {
    const verifyPayment = async () => {
      if (!reservationRef || verificationAttempted) return;

      setVerificationAttempted(true);

      try {
        const response = await fetch(`${API_URL}/v1/booking/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationReference: reservationRef }),
        });

        if (response.ok) {
          // Payment verified successfully, refetch status
          setTimeout(() => refetch(), 1000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        // Don't show error toast here as the periodic status check will handle it
      }
    };

    verifyPayment();
  }, [reservationRef, verificationAttempted, refetch]);

  // Handle successful booking confirmation
  useEffect(() => {
    if (data?.status === 'CONFIRMED' && data.reservation) {
      toast({
        title: 'Booking Confirmed!',
        description:
          'Your reservation has been successfully confirmed. Check your email for details.',
        variant: 'success',
      });

      // Navigate to confirmation page with booking details
      setTimeout(() => {
        navigate('/reservation/confirmation', {
          state: { reservation: data.reservation },
        });
      }, 2000);
    }
  }, [data, navigate, toast]);

  if (!reservationRef) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Payment Reference</h1>
          <p className="text-gray-600 mb-4">No reservation reference was provided.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || data?.status === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Processing Your Payment</h1>
          <p className="text-gray-600 mb-4">
            Please wait while we verify your payment and confirm your reservation...
          </p>
          <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">
              Reference: <span className="font-mono text-gray-700">{reservationRef}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || data?.status === 'NOT_FOUND') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-4">
            We couldn't verify your payment. Please contact support if you believe this is an error.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Return Home
            </button>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // This should not render as useEffect will navigate away
  if (data?.status === 'CONFIRMED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">Redirecting to your booking confirmation...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;
