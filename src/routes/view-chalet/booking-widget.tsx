import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  differenceInDays,
  eachDayOfInterval,
  format,
  isBefore,
  isSameDay,
  startOfToday,
} from 'date-fns';
import GuestSelector from './guest-selector';
import { useNavigate } from 'react-router-dom';
import { Booking } from './view-chalet-types';

interface ChaletImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
  label: string;
}

interface ChaletRoom {
  id?: string;
  roomType: string;
  room?: number;
  capacity: number;
  bunkBedCapacity:number | null;
  floor:number;
  numberOfRooms:number;
  hasBunkBed:boolean;
  notEnsuite: boolean;
}

interface ChaletUnavailableDate {
  id: string;
  chaletId?: string;
  date: string;
}

interface ChaletBookingProps {
  chalet: {
    id: string;
    name: string;
    basePrice: string;
    images: ChaletImage[];
    propertyType: string;
    maxAdults:number;
    maxChildren:number;
    totalSleeps:number;
    rooms: ChaletRoom[];
    ChaletUnavailableDates: ChaletUnavailableDate[];
    bookings: Booking[];
  };
}

interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
  intervalDates: Date[];
}

const ChaletBookingWidget = ({ chalet }: ChaletBookingProps) => {
  const navigate = useNavigate();
  const today = startOfToday();
  const [dates, setDates] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
    intervalDates: [],
  });
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [loading, setLoading] = useState(false);

  const totalCapacity = chalet.rooms.reduce((sum, room) => sum + room.capacity, 0);
  const basePrice = parseInt(chalet.basePrice);
  // const cleaningFee = 1500;
  // const serviceFee = 4500;

  // const unavailableDates = chalet.ChaletUnavailableDates.map((d) => new Date(d.date));

  const numberOfNights =
    dates.checkIn && dates.checkOut ? differenceInDays(dates.checkOut, dates.checkIn) : 0;

  const subtotal = basePrice * numberOfNights;
  // const total = subtotal + cleaningFee + serviceFee;
  const total = subtotal;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (!dates.checkIn || (dates.checkIn && dates.checkOut)) {
      // Setting check-in date
      setDates({
        checkIn: selectedDate,
        checkOut: null,
        intervalDates: [],
      });
    } else {
      // Setting check-out date
      if (selectedDate < dates.checkIn) {
        // If selected date is before check-in, swap them
        const intervalDates = eachDayOfInterval({
          start: selectedDate,
          end: dates.checkIn,
        });
        setDates({
          checkIn: selectedDate,
          checkOut: dates.checkIn,
          intervalDates,
        });
      } else {
        const intervalDates = eachDayOfInterval({
          start: dates.checkIn,
          end: selectedDate,
        });
        setDates({
          ...dates,
          checkOut: selectedDate,
          intervalDates,
        });
      }
    }
  };

  const handleReserve = async () => {
    setLoading(true);
    try {
      // Validate required data
      if (!dates.checkIn || !dates.checkOut) {
        throw new Error('Please select check-in and check-out dates');
      }

      // Prepare the chalet data for the confirmation page
      const chaletData = {
        id: chalet.id,
        name: chalet.name,
        price: chalet.basePrice,
        chaletType: chalet.propertyType,
        chaletImage: chalet.images?.find((image) => image.isMain)?.url || null, // Use .url or the appropriate property for the image
      };

      // Navigate to confirmation page with all required data
      navigate('/reservation/confirm', {
        state: {
          chalet: chaletData,
          checkIn: dates.checkIn.toISOString(),
          checkOut: dates.checkOut.toISOString(),
          selectedDates: dates.intervalDates.map((date) => date.toISOString()),
          adults: guests.adults,
          children: guests.children,
        },
      });
    } catch (error) {
      console.error('Reservation error:', error);
      // Handle error appropriately here
    } finally {
      setLoading(false);
    }
  };

  // Convert unavailable dates and booking dates to Date objects
  const disabledDates = [
    ...chalet.ChaletUnavailableDates.map((d) => new Date(d.date)),
    // Now using bookingDates array directly instead of calculating between start/end
    ...chalet.bookings.flatMap((booking) =>
      booking.bookingDates.map((date) => new Date(date.date)),
    ),
  ];

  const isDateDisabled = (date: Date) => {
    return (
      isBefore(date, today) || disabledDates.some((disabledDate) => isSameDay(date, disabledDate))
    );
  };

  return (
    <div className="sticky top-4 bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-2xl font-bold">KES {basePrice.toLocaleString()}</span>
          <span className="text-gray-500"> / night</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 border rounded-lg">
          <Popover>
            <PopoverTrigger asChild>
              <div className="p-3 border-r cursor-pointer">
                <div className="text-xs font-medium">CHECK-IN</div>
                <div className="mt-1">
                  {dates.checkIn ? format(dates.checkIn, 'MMM dd, yyyy') : 'Select date'}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dates.checkIn || undefined}
                onSelect={(date) => date && handleDateSelect(date)}
                disabled={(date) => (date ? isDateDisabled(date) : true)}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <div className="p-3 cursor-pointer">
                <div className="text-xs font-medium">CHECK-OUT</div>
                <div className="mt-1">
                  {dates.checkOut ? format(dates.checkOut, 'MMM dd, yyyy') : 'Select date'}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dates.checkOut || undefined}
                onSelect={(date) => date && handleDateSelect(date)}
                disabled={(date) => {
                  if (!date) return true;
                  return isDateDisabled(date) || (dates.checkIn ? date <= dates.checkIn : false);
                }}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full h-12 justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>
                  {guests.adults + guests.children} guest
                  {guests.adults + guests.children !== 1 ? 's' : ''}
                  {guests.infants > 0
                    ? `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`
                    : ''}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <GuestSelector guests={guests} setGuests={setGuests} maxGuests={totalCapacity} />
          </PopoverContent>
        </Popover>

        <Button
          className="w-full py-6 bg-emerald-600 text-white text-base rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          disabled={!dates.checkIn || !dates.checkOut || loading}
          onClick={handleReserve}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Reserve'
          )}
        </Button>

        {numberOfNights > 0 && (
          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <span>
                KES {basePrice.toLocaleString()} × {numberOfNights} nights
              </span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>KES {cleaningFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>KES {serviceFee.toLocaleString()}</span>
            </div> */}
            <div className="pt-4 border-t flex justify-between font-bold">
              <span>Total</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChaletBookingWidget;
