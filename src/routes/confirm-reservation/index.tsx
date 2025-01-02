import { differenceInDays, format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, Calendar, Users, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { API_URL, PAYSTACK_PUBLIC_KEY } from '@/config';
import { usePaystackPayment } from 'react-paystack';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { ApiAddonResponse, ReservationData } from './types';
import { AddonSelector, SelectedAddons } from './addon-selector';
import { PriceBreakdown } from './PriceBreakdown';

interface ReferenceData {
  message: string;
  redirecturl: string;
  reference: string;
  return?: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

// Mutation function
const createReservation = async (reservationData: ReservationData) => {
  const response = await fetch(`${API_URL}/v1/chalets/booking/reserve-chalet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });

  if (!response.ok) {
    throw new Error('Failed to create reservation');
  }

  return response.json();
};

const ConfirmReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['addons'],
    queryFn: async () => {
      const response = await axios.get<ApiAddonResponse>(`${API_URL}/v1/addons/all-addons`);
      return response.data.addons;
    },
  });

  const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});

  // Add this function in ConfirmReservation
  const handleAddonChange = (addonId: string, isSelected: boolean) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: isSelected,
    }));
  };

  // Calculate addons total (add this before finalAmount calculation)
  const addonsTotal =
    data?.reduce((total, addon) => {
      return total + (selectedAddons[addon.id] ? parseInt(addon.price) : 0);
    }, 0) ?? 0;

  const { chalet, checkIn, checkOut, adults, children, selectedDates } = location.state || {};

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    nationality: '',
    nationalIdNumber: '',
  });

  const totalNights = differenceInDays(new Date(checkOut), new Date(checkIn));
  const totalAmount = parseFloat(chalet.price) * totalNights;
  const taxAmount = totalAmount * 0.16; // 16% tax
  // const finalAmount = totalAmount + taxAmount;

  // Update finalAmount calculation
  const finalAmount = totalAmount + taxAmount + addonsTotal;

  const mutation = useMutation({
    mutationFn: createReservation,
    onSuccess: (data) => {
      toast({
        title: 'Booking Confirmed!',
        description:
          'Your reservation has been successfully confirmed. Check your email for details.',
        variant: 'success',
      });

      navigate('/reservation/confirmation', {
        state: {
          reservation: data,
        },
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Unable to complete your reservation. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  const onSuccess = async (reference: ReferenceData) => {
    setIsProcessing(true); // Start loading
    try {
      const reservationData = {
        customerId: null,
        chaletId: chalet.id,
        checkIn,
        checkOut,
        selectedDates,
        adults,
        children,
        totalCost: finalAmount,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        customer,
        addons: Object.keys(selectedAddons)
          .filter((id) => selectedAddons[id])
          .map((id) => ({
            addonId: id,
            quantity: 1,
            price: data?.find((addon) => addon.id === id)?.price ?? 0,
          })),
        payment: {
          amount: finalAmount,
          paymentMethod: 'PAYSTACK',
          transactionId: reference.reference,
          status: 'PAID',
        },
      };

      mutation.mutate(reservationData);
    } catch (error) {
      console.error('Reservation failed:', error);
      setIsProcessing(false); // Reset loading on error
    }
  };

  const onClose = () => {
    console.log('Payment canceled');
    setIsProcessing(false); // Reset loading if payment is cancelled
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: customer.email,
    amount: finalAmount * 100,
    publicKey: `${PAYSTACK_PUBLIC_KEY}`,
    currency: 'KES',
    // onClose   // Add callback here
  };

  const initializePayment = usePaystackPayment(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.email) {
      console.error('Customer email is required');
      return;
    }

    initializePayment({ onSuccess, onClose });
  };

  if (!chalet) {
    navigate('/search');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`Confirm Reservation - ${chalet?.name}`}</title>
        <meta name="description" content="Confirm reservation for the chalet" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Form */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Complete your reservation</h1>
                <p className="mt-2 text-gray-600">Please enter your details to confirm your stay</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Guest Information Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Guest Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        className="mt-1"
                        value={customer.firstName}
                        disabled={isProcessing}
                        onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        className="mt-1"
                        value={customer.lastName}
                        disabled={isProcessing}
                        onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-1"
                      value={customer.email}
                      disabled={isProcessing}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      className="mt-1"
                      value={customer.phone}
                      disabled={isProcessing}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-700">
                      Address
                    </Label>
                    <Input
                      id="address"
                      className="mt-1"
                      value={customer.address}
                      disabled={isProcessing}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {!isLoading && data && (
                  <AddonSelector
                    addons={data}
                    selectedAddons={selectedAddons}
                    onAddonChange={handleAddonChange}
                  />
                )}

                {/* National ID Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Identification</h2>
                  <div>
                    <Label htmlFor="nationality" className="text-gray-700">
                      Nationality
                    </Label>
                    <Input
                      id="nationality"
                      className="mt-1"
                      value={customer.nationality}
                      disabled={isProcessing}
                      onChange={(e) => setCustomer({ ...customer, nationality: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationalId" className="text-gray-700">
                      National ID/Passport Number
                    </Label>
                    <Input
                      id="nationalId"
                      className="mt-1"
                      value={customer.nationalIdNumber}
                      disabled={isProcessing}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          nationalIdNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg relative bg-[#27534c] hover:bg-[#1c3d38]"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing your reservation...
                    </>
                  ) : (
                    <>
                      Proceed to Payment <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:sticky lg:top-8 space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="space-y-6">
                  {/* Chalet Image and Details */}
                  <div>
                    <img
                      src={chalet.chaletImage}
                      alt={chalet.name}
                      className="w-full h-60 object-cover bg-center rounded-lg"
                    />
                    <h3 className="mt-4 text-xl font-semibold">{chalet.name}</h3>
                    <p className="text-gray-600">{chalet.chaletType}</p>
                  </div>

                  <Separator />

                  {/* Stay Details */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-medium">
                          {format(new Date(checkIn), 'EEE, MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-medium">
                          {format(new Date(checkOut), 'EEE, MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-medium">
                          {adults} Adults, {children} Children
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  {/* <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        KES {parseInt(chalet.price).toLocaleString()} x {totalNights} nights
                      </span>
                      <span>
                        KES{' '}
                        {Number(totalAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes (16%)</span>
                      <span>
                        KES{' '}
                        {Number(taxAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    {addonsTotal > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Additional Services</span>
                        <span>
                          KES{' '}
                          {addonsTotal.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        KES{' '}
                        {Number(finalAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div> */}
                  <PriceBreakdown
                    totalAmount={totalAmount}
                    taxAmount={taxAmount}
                    selectedAddons={selectedAddons}
                    addons={data || []}
                  />

                  {/* Security Note */}
                  <div className="flex items-center text-sm text-gray-600 mt-4">
                    <Lock className="h-4 w-4 mr-2" />
                    <p>Secured checkout powered by Paystack</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmReservation;
