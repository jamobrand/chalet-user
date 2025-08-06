import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, ChevronRight, Loader2, Users, Lock } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { AddonSelector, SelectedAddons } from './addon-selector';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApiAddonResponse, CreatePaymentTokenRequest, CreatePaymentTokenResponse } from './types';
import { Separator } from '@/components/ui/separator';
import { differenceInDays, format } from 'date-fns';
import { PriceBreakdown } from './PriceBreakdown';
import { API_URL } from '@/config';
import { useToast } from '@/hooks/use-toast';

interface ErrorMessage {
  message:string;
  error: string;
}

// Mutation function for creating payment token
const createPaymentToken = async (
  tokenData: CreatePaymentTokenRequest,
): Promise<CreatePaymentTokenResponse> => {
  const response = await fetch(`${API_URL}/v1/booking/create-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokenData),
  });

  if (!response.ok) {
    const errorData:ErrorMessage = await response.json();
    throw new Error(errorData.error || 'Failed to process payment. Please try again.');
  }

  const result = await response.json();
  return result.data;
};


const ConfirmReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    nationality: '',
    nationalIdNumber: '',
  });
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});

  const { chalet, checkIn, checkOut, adults, children, selectedDates } = location.state || {};

  const { data, isLoading } = useQuery({
    queryKey: ['addons'],
    queryFn: async () => {
      const response = await axios.get<ApiAddonResponse>(`${API_URL}/v1/addons/all-addons`);
      return response.data.addons;
    },
  });

  // Add this function in ConfirmReservation
  const handleAddonChange = (addonId: string, isSelected: boolean) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: isSelected,
    }));
  };

  // Calculate addons total
  const addonsTotal =
    data?.reduce((total, addon) => {
      return total + (selectedAddons[addon.id] ? parseInt(addon.price) : 0);
    }, 0) ?? 0;

  const totalNights = differenceInDays(new Date(checkOut), new Date(checkIn));
  const totalAmount = parseFloat(chalet.price) * totalNights;
  const taxAmount = totalAmount * 0.16; // 16% tax
  const finalAmount = totalAmount + taxAmount + addonsTotal;

  const mutation = useMutation({
    mutationFn: createPaymentToken,
    onSuccess: (data) => {
      // Store reservation reference in localStorage for return handling
      localStorage.setItem('currentReservationRef', data.reservationReference);

      // Redirect to DPO payment page
      window.location.href = data.paymentUrl;
    },
    onError: (error: Error) => {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!customer.email) {
      toast({
        title: 'Validation Error',
        description: 'Customer email is required',
        variant: 'destructive',
      });
      setIsProcessing(false);
      return;
    }

    const tokenData: CreatePaymentTokenRequest = {
      chaletId: chalet.id,
      checkIn,
      checkOut,
      adults,
      children,
      totalCost: finalAmount,
      selectedDates,
      customer,
      addons: Object.keys(selectedAddons)
        .filter((id) => selectedAddons[id])
        .map((id) => ({
          addonId: id,
          quantity: 1,
          price: parseInt(data?.find((addon) => addon.id === id)?.price ?? '0'),
        })),
    };

    mutation.mutate(tokenData);
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
                      Processing payment...
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
                  <PriceBreakdown
                    totalAmount={totalAmount}
                    taxAmount={taxAmount}
                    selectedAddons={selectedAddons}
                    addons={data || []}
                  />

                  {/* Security Note */}
                  <div className="flex items-center text-sm text-gray-600 mt-4">
                    <Lock className="h-4 w-4 mr-2" />
                    <p>Secured checkout powered by DPO</p>
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
